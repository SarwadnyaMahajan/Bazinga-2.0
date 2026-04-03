"""
scripts/build_policy_index.py

Run this once to:
1. Read raw policy PDFs from policy_store/raw/
2. Chunk them into smaller pieces
3. Save chunks to policy_store/chunks/
4. Build FAISS index + BM25 corpus in policy_store/indexes/

Usage:
    python scripts/build_policy_index.py
"""
import os
import json
import pickle
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

RAW_DIR = "policy_store/raw"
CHUNKS_DIR = "policy_store/chunks"
INDEX_DIR = "policy_store/indexes"
CHUNK_SIZE = 300  # words per chunk


def read_pdf(path: str) -> str:
    try:
        import PyPDF2
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            return " ".join(page.extract_text() or "" for page in reader.pages)
    except Exception as e:
        print(f"Could not read {path}: {e}")
        return ""


def chunk_text(text: str, source: str, chunk_size: int = CHUNK_SIZE) -> list[dict]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append({"text": chunk, "source": source})
    return chunks


def build_indexes(all_chunks: list[dict]):
    texts = [c["text"] for c in all_chunks]

    os.makedirs(INDEX_DIR, exist_ok=True)

    # BM25
    from rank_bm25 import BM25Okapi
    tokenized = [t.lower().split() for t in texts]
    bm25 = BM25Okapi(tokenized)
    with open(os.path.join(INDEX_DIR, "bm25_corpus.pkl"), "wb") as f:
        pickle.dump({"bm25": bm25, "texts": texts}, f)
    print(f"BM25 index saved ({len(texts)} chunks)")

    # FAISS
    try:
        import faiss
        import numpy as np
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer("all-MiniLM-L6-v2")
        vecs = model.encode(texts, show_progress_bar=True).astype("float32")

        index = faiss.IndexFlatL2(vecs.shape[1])
        index.add(vecs)
        faiss.write_index(index, os.path.join(INDEX_DIR, "faiss.index"))
        print(f"FAISS index saved ({index.ntotal} vectors)")

    except ImportError:
        print("FAISS/sentence-transformers not installed — skipping FAISS index.")


def main():
    os.makedirs(CHUNKS_DIR, exist_ok=True)

    if not os.path.exists(RAW_DIR) or not os.listdir(RAW_DIR):
        print(f"No PDFs found in {RAW_DIR}. Add policy PDFs and re-run.")
        # Create sample chunks so the system works without PDFs
        sample_chunks = {
            "car": [
                {"text": "Car insurance covers damage to the vehicle caused by accidents collisions and natural disasters. Bumper damage windshield cracks and door dents are covered under comprehensive policy.", "source": "sample_car"},
                {"text": "The policy covers repair costs for front and rear bumper damage including labor and parts. Claim must be filed within 30 days of incident.", "source": "sample_car"},
                {"text": "Windshield and glass damage is covered under zero depreciation add-on. Police FIR required for theft claims.", "source": "sample_car"},
            ],
            "travel": [
                {"text": "Travel insurance covers flight delays of more than 3 hours. Original boarding pass and airline delay certificate required.", "source": "sample_travel"},
                {"text": "Baggage loss coverage applies when airline confirms loss in writing. Maximum limit per bag as per policy schedule.", "source": "sample_travel"},
                {"text": "Medical emergency coverage applies for hospitalisation abroad. Original bills and discharge summary required for claim.", "source": "sample_travel"},
                {"text": "Trip cancellation coverage applies for cancellations due to medical emergency natural disaster or airline insolvency.", "source": "sample_travel"},
            ],
            "general": [
                {"text": "All claims must be supported by valid evidence. Policy must be active at the time of incident. Duplicate claims will be rejected.", "source": "sample_general"},
            ]
        }
        for fname, chunks in sample_chunks.items():
            out_path = os.path.join(CHUNKS_DIR, f"{fname}_policy.json")
            with open(out_path, "w") as f:
                json.dump(chunks, f, indent=2)
            print(f"Sample chunks written: {out_path}")

        all_chunks = [c for chunks in sample_chunks.values() for c in chunks]
        build_indexes(all_chunks)
        return

    all_chunks = []
    for fname in os.listdir(RAW_DIR):
        if not fname.endswith(".pdf"):
            continue
        path = os.path.join(RAW_DIR, fname)
        text = read_pdf(path)
        if not text.strip():
            continue
        chunks = chunk_text(text, fname)
        all_chunks.extend(chunks)

        out_path = os.path.join(CHUNKS_DIR, fname.replace(".pdf", ".json"))
        with open(out_path, "w") as f:
            json.dump(chunks, f, indent=2)
        print(f"Chunked {fname} → {len(chunks)} chunks")

    build_indexes(all_chunks)
    print(f"\nDone. Total chunks: {len(all_chunks)}")


if __name__ == "__main__":
    main()
