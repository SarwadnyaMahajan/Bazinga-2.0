from app.utils.logger import get_logger

logger = get_logger(__name__)

# Expected OCR fields per travel category
TRAVEL_CATEGORY_EXPECTED_FIELDS = {
    "flight delay":        ["booking_ref", "airline", "date"],
    "flight cancellation": ["booking_ref", "date"],
    "luggage lost":        ["booking_ref"],
}


def compute_consistency_score(claim_type: str, user_input: dict, model_output: dict) -> float:
    """
    Car:    user dropdown (exact YOLO class name) vs YOLO predicted labels
            1.0 = exact match, 0.3 = model detected something else, 0.0 = nothing detected
    Travel: user dropdown category vs OCR extracted fields
            ratio of expected fields found in extracted output
    """
    try:
        if claim_type == "car":
            selected = user_input.get("selected_damage", "").lower().strip()
            detected_labels = [l.lower().strip() for l in model_output.get("labels", [])]

            if not detected_labels:
                logger.warning(f"Car consistency: YOLO detected nothing")
                return 0.0

            if selected in detected_labels:
                logger.info(f"Car consistency: Exact match — {selected}")
                return 1.0
            else:
                logger.warning(f"Car consistency: Mismatch — selected={selected}, detected={detected_labels}")
                return 0.3  # model found damage but different class

        elif claim_type == "travel":
            selected = user_input.get("selected_category", "").lower().strip()
            extracted = model_output.get("extracted_fields", {})

            expected_fields = TRAVEL_CATEGORY_EXPECTED_FIELDS.get(selected, [])

            if not expected_fields:
                logger.warning(f"Travel consistency: Unknown category '{selected}'")
                return 0.5  # neutral for unknown category

            if not extracted:
                logger.warning(f"Travel consistency: OCR extracted nothing")
                return 0.0

            matches = sum(1 for f in expected_fields if f in extracted)
            score = round(matches / len(expected_fields), 4)
            logger.info(f"Travel consistency: category={selected}, fields found={matches}/{len(expected_fields)}, score={score}")
            return score

        else:
            return 0.5

    except Exception as e:
        logger.error(f"Consistency score error: {e}")
        return 0.0
