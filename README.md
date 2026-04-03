# Insurance STP — Intelligent Claim Processing

Automated insurance claim processing with Straight-Through Processing (STP) for Car and Travel claims.

---

## Quick Start

### 1. Clone & Install
```bash
cd insurance-stp
pip install -r requirements.txt
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your keys:
# - ROBOFLOW_API_KEY + ROBOFLOW_MODEL_ID
# - SMTP credentials (Gmail App Password recommended)
# - TELEGRAM_BOT_TOKEN + TELEGRAM_REVIEWER_CHAT_ID
```

### 3. Build policy index (run once)
```bash
python scripts/build_policy_index.py
```
Add your policy PDFs to `policy_store/raw/` before running.
Without PDFs, it auto-generates sample policy chunks so the system still works.

### 4. Run the server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Open API docs
```
http://localhost:8000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/car/submit` | Submit a car insurance claim |
| POST | `/travel/submit` | Submit a travel insurance claim |
| GET | `/review/queue` | View all claims pending manual review |
| POST | `/review/{id}/decision` | Reviewer approves or rejects a claim |
| GET | `/health` | Health check |

---

## Car Claim — Form Fields

| Field | Type | Description |
|-------|------|-------------|
| claimant_name | string | Full name |
| claimant_email | string | Email for notifications |
| claimant_telegram_id | string (optional) | Telegram chat ID |
| policy_number | string | e.g. CAR001 |
| description | string | Description of the incident |
| reported_damage_type | string | e.g. "front bumper", "windshield" |
| estimated_amount | float | Claim amount in INR |
| evidence | file | Photo of damage (JPEG/PNG, taken from camera) |

## Travel Claim — Form Fields

| Field | Type | Description |
|-------|------|-------------|
| claimant_name | string | Full name |
| claimant_email | string | Email for notifications |
| claimant_telegram_id | string (optional) | Telegram chat ID |
| policy_number | string | e.g. TRAVEL001 |
| description | string | Description of the claim |
| trip_origin | string | Departure city |
| trip_destination | string | Destination city |
| travel_date | string | YYYY-MM-DD |
| claim_category | string | flight_delay / baggage_loss / medical / trip_cancellation |
| estimated_amount | float | Claim amount in INR |
| evidence | file | Document photo (ticket, bill, etc.) |

---

## STP Decision Logic

```
Final Score = 0.4 × Consistency + 0.35 × Evidence + 0.25 × Policy

≥ 0.75  →  AUTO APPROVE  →  Settlement + Email/Telegram notification
0.5–0.75 → MANUAL REVIEW →  Reviewer queue + Claimant notified
< 0.5   →  REJECT        →  Email/Telegram with reason
```

---

## Active Policy Numbers (for testing)
- Car: `CAR001`, `CAR002`, `POL001`, `POL002`, `POL003`
- Travel: `TRAVEL001`, `TRAVEL002`, `POL001`, `POL002`, `POL003`

---

## Project Structure

```
app/
  api/          # Route handlers (car, travel, review)
  pipeline/
    car/        # Metadata check → Validation → YOLO extractor
    travel/     # Metadata check → Validation → OCR extractor
    shared/     # Consistency + Evidence + Policy scoring → STP decision
  services/     # Settlement + Notifications (email + Telegram)
  db/           # SQLAlchemy models + CRUD
  utils/        # File handling, hashing, logging
ml_models/ocr/  # EasyOCR wrapper + field parser
policy_store/   # Raw PDFs → chunked JSON → FAISS + BM25 indexes
scripts/        # build_policy_index.py, seed_db.py
```
