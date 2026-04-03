"""
STP Decision Engine
≥ 0.75 → AUTO_APPROVE
0.5 – 0.75 → MANUAL_REVIEW
< 0.5  → REJECT
"""
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def make_stp_decision(scores: dict) -> dict:
    """
    scores: output from scoring_engine.compute_final_score()
    Returns: { "decision": str, "reason": str }
    """
    policy_val = scores.get("policy_score", 0.0)
    final = scores["final_score"]

    # --- MANDATORY POLICY CHECK ---
    # Even if other scores are high, a low policy score means rejection.
    if policy_val < settings.reject_threshold:
        decision = "REJECT"
        reason = (
            f"Policy coverage validation failed (Score: {policy_val:.2f}). "
            f"The claim does not match recognized policy clauses or exceeds strict limits."
        )
        logger.warning(f"STP Policy Hard-Reject: {policy_val:.2f}")
        return {"decision": decision, "reason": reason}

    if final >= settings.auto_approve_threshold:
        decision = "AUTO_APPROVE"
        reason = (
            f"Claim scored {final:.2f} — all checks passed with high confidence. "
            f"Proceeding to automatic settlement."
        )

    elif final >= settings.reject_threshold:
        decision = "MANUAL_REVIEW"
        reason = (
            f"Claim scored {final:.2f} — within manual review range "
            f"({settings.reject_threshold}–{settings.auto_approve_threshold}). "
            f"Assigned to reviewer queue."
        )

    else:
        decision = "REJECT"
        reason = (
            f"Claim scored {final:.2f} — below rejection threshold of "
            f"{settings.reject_threshold}. Insufficient evidence or policy mismatch."
        )

    logger.info(f"STP Decision: {decision} | Score: {final:.2f}")
    return {"decision": decision, "reason": reason}
