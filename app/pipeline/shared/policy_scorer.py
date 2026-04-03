import json
from groq import Groq
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def compute_policy_score(
    chunks: list[dict], 
    user_description: str, 
    claim_type: str,
    consistency_score: float = 1.0,
    detected_labels: list[str] = None
) -> dict:
    """
    Policy Score (P) & Groq Reasoning:
    Uses Groq LLM to cross-reference user description with policy chunks AND visual evidence.
    
    Returns: { "score": float, "reasoning": str }
    """
    if not chunks:
        return {"score": 0.5, "reasoning": "Policy documents not yet loaded. Coverage assumed neutral pending PDF upload."}

    client = Groq(api_key=settings.groq_api_key)
    detected_labels = detected_labels or []
    
    # Construct context from chunks
    context = "\n\n".join([f"Content: {c['text']}" for c in chunks])
    
    prompt = f"""
    You are an AI Insurance Adjuster. Review the following claim against the provided policy documents and visual evidence findings.
    
    CLAIM TYPE: {claim_type}
    USER DESCRIPTION: {user_description}
    
    EVIDENCE FINDINGS (from Computer Vision/OCR):
    - Consistency Score: {consistency_score} (1.0 = Perfect match, 0.0 = Complete mismatch)
    - Detected Items: {', '.join(detected_labels) if detected_labels else 'None'}
    
    RELEVANT POLICY CLAUSES:
    {context}
    
    TASK:
    1. Determine if the claim is likely covered based on the policy clauses.
    2. IMPORTANT: If the EVIDENCE FINDINGS show a low consistency score or the Detected Items do not match the USER DESCRIPTION, you MUST lower your score and explain the mismatch in your reasoning.
    3. Provide a score from 0.0 to 1.0 (highly likely covered = 1.0, clearly excluded or fraudulent = 0.0).
    4. Provide a brief explanation for your choice.
    
    OUTPUT FORMAT (JSON):
    {{
      "score": float,
      "reasoning": "string"
    }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional insurance claim analyst. Output ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=settings.groq_model_name,
            response_format={"type": "json_object"}
        )
        
        response_json = json.loads(chat_completion.choices[0].message.content)
        score = response_json.get("score", 0.5)
        reasoning = response_json.get("reasoning", "Unable to determine exact policy coverage.")
        
        logger.info(f"Groq Policy Score: {score}, Reasoning: {reasoning}")
        return {"score": round(float(score), 4), "reasoning": reasoning}

    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return {"score": 0.5, "reasoning": f"Coverage evaluation pending due to technical error: {str(e)}"}
