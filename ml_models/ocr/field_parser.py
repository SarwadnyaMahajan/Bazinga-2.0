"""
ml_models/ocr/field_parser.py
Parses raw OCR text into structured fields.
"""
import re


def parse_travel_fields(raw_text: str) -> dict:
    """
    Attempts to extract key travel document fields from OCR text.
    """
    fields = {}
    text = raw_text

    # Amount: Rs. 1234 / INR 5,000 / $500
    amount = re.search(r"(?:rs\.?|inr|usd|\$|€|£)\s*([\d,]+\.?\d*)", text, re.IGNORECASE)
    if amount:
        fields["amount"] = amount.group(1).replace(",", "")

    # Date: DD/MM/YYYY or MM-DD-YYYY
    date = re.search(r"\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b", text)
    if date:
        fields["date"] = date.group(1)

    # PNR / Booking reference
    pnr = re.search(r"\b(PNR|BOOKING|REF)[:\s#]*([A-Z0-9]{5,10})\b", text, re.IGNORECASE)
    if pnr:
        fields["booking_ref"] = pnr.group(2)
    else:
        # Try standalone alphanumeric code
        code = re.search(r"\b([A-Z]{2}\d{4,6})\b", text)
        if code:
            fields["booking_ref"] = code.group(1)

    # Airline
    airlines = [
        "indigo", "air india", "spicejet", "vistara", "go first",
        "akasa", "emirates", "lufthansa", "british airways", "qatar"
    ]
    text_lower = text.lower()
    for airline in airlines:
        if airline in text_lower:
            fields["airline"] = airline.title()
            break

    # Hospital / Medical
    if any(w in text_lower for w in ["hospital", "clinic", "medical", "diagnosis", "discharge"]):
        fields["document_type"] = "medical"

    return fields
