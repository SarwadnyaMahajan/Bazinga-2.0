"""
Hybrid Policy Retriever
Combines FAISS (semantic) + BM25 (keyword) search over policy chunks.
Returns top-K policy chunks most relevant to the claim description.

On first run, if no index exists, falls back to keyword-only matching.
"""
import os
import json
import pickle
from app.utils.logger import get_logger

logger = get_logger(__name__)

CHUNKS_DIR = "policy_store/chunks"
FAISS_INDEX_PATH = "policy_store/indexes/faiss.index"
BM25_CORPUS_PATH = "policy_store/indexes/bm25_corpus.pkl"

TOP_K = 5


def retrieve_policy_chunks(query: str, claim_type: str) -> list[dict]:
    """
    Returns list of relevant policy chunk dicts: [{"text": ..., "score": ...}]
    """
    try:
        return _hybrid_retrieve(query, claim_type)
    except Exception as e:
        logger.warning(f"Hybrid retrieval failed ({e}), falling back to keyword match.")
        return _fallback_keyword_match(query, claim_type)


def _hybrid_retrieve(query: str, claim_type: str) -> list[dict]:
    chunks = _load_chunks(claim_type)
    if not chunks:
        return []

    texts = [c["text"] for c in chunks]

    # --- BM25 ---
    from rank_bm25 import BM25Okapi
    tokenized = [t.lower().split() for t in texts]
    bm25 = BM25Okapi(tokenized)
    bm25_scores = bm25.get_scores(query.lower().split())

    # --- FAISS (semantic) ---
    faiss_scores = [0.0] * len(texts)
    try:
        import faiss
        import numpy as np
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer("all-MiniLM-L6-v2")

        if os.path.exists(FAISS_INDEX_PATH):
            index = faiss.read_index(FAISS_INDEX_PATH)
            query_vec = model.encode([query]).astype("float32")
            distances, indices = index.search(query_vec, TOP_K)
            for rank, idx in enumerate(indices[0]):
                if idx < len(faiss_scores):
                    faiss_scores[idx] = float(1 / (1 + distances[0][rank]))
        else:
            logger.info("No FAISS index found — building in memory.")
            vecs = model.encode(texts).astype("float32")
            query_vec = model.encode([query]).astype("float32")
            import numpy as np
            sims = np.dot(vecs, query_vec.T).flatten()
            faiss_scores = sims.tolist()

    except Exception as e:
        logger.warning(f"FAISS scoring failed: {e}")

    # --- Combine scores (equal weight) ---
    max_bm25 = max(bm25_scores) if max(bm25_scores) > 0 else 1
    combined = []
    for i, chunk in enumerate(chunks):
        norm_bm25 = bm25_scores[i] / max_bm25
        score = 0.5 * norm_bm25 + 0.5 * faiss_scores[i]
        combined.append({"text": chunk["text"], "score": round(score, 4), "source": chunk.get("source", "")})

    combined.sort(key=lambda x: x["score"], reverse=True)
    return combined[:TOP_K]


def _load_chunks(claim_type: str) -> list[dict]:
    """Load pre-chunked policy JSON files for the given claim type."""
    chunks = []
    if not os.path.exists(CHUNKS_DIR):
        return chunks

    for fname in os.listdir(CHUNKS_DIR):
        if not fname.endswith(".json"):
            continue
        if claim_type not in fname and "general" not in fname:
            continue
        with open(os.path.join(CHUNKS_DIR, fname)) as f:
            data = json.load(f)
            if isinstance(data, list):
                chunks.extend(data)
            elif isinstance(data, dict) and "chunks" in data:
                chunks.extend(data["chunks"])

    return chunks


def _fallback_keyword_match(query: str, claim_type: str) -> list[dict]:
    """Simple keyword matching fallback when indexes are unavailable."""
    chunks = _load_chunks(claim_type)
    if not chunks:
        # Return a generic policy match so scoring can proceed
        return [{"text": f"Standard {claim_type} insurance coverage applies.", "score": 0.5}]

    query_words = set(query.lower().split())
    scored = []
    for chunk in chunks:
        words = set(chunk["text"].lower().split())
        overlap = len(query_words & words)
        scored.append({"text": chunk["text"], "score": overlap / max(len(query_words), 1)})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:TOP_K]
