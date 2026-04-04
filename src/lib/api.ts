// API utilities for Insurance STP Backend

const BASE_URL = "https://bazinga-2-0-2.onrender.com";

export type ClaimStatus = "pending" | "manual_review" | "settled" | "rejected";
export type STPDecision = "AUTO_APPROVE" | "MANUAL_REVIEW" | "REJECT";

export interface SubmitResponse {
  claim_id: string;
  status: ClaimStatus;
  stp_decision: STPDecision;
  final_score: number;
  message: string;
  reasoning: string;
  transaction_id?: string;
}

export interface ReviewQueueItem {
  claim_id: string;
  claim_type: "car" | "travel";
  claimant_name: string;
  claimant_email: string;
  policy_number: string;
  description: string;
  final_score: number;
  created_at: string;
}

export interface DecisionResponse {
  claim_id: string;
  decision: "approved" | "rejected";
  transaction_id?: string;
  message: string;
}

// 1. Submit Car Claim
export async function submitCarClaim(formData: FormData): Promise<SubmitResponse> {
  const response = await fetch(`${BASE_URL}/car/submit`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit car claim");
  }

  return response.json();
}

// 2. Submit Travel Claim
export async function submitTravelClaim(formData: FormData): Promise<SubmitResponse> {
  const response = await fetch(`${BASE_URL}/travel/submit`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit travel claim");
  }

  return response.json();
}

// 3. Get Review Queue
export async function getReviewQueue(): Promise<ReviewQueueItem[]> {
  const response = await fetch(`${BASE_URL}/review/queue`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch review queue");
  }

  return response.json();
}

// 4. Submit Review Decision
export async function submitReviewDecision(
  claimId: string, 
  decision: "approve" | "reject",
  reviewerName: string,
  notes?: string
): Promise<DecisionResponse> {
  const response = await fetch(`${BASE_URL}/review/${claimId}/decision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    credentials: "include",
    body: JSON.stringify({
      decision,
      reviewer_name: reviewerName,
      notes,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit review decision");
  }

  return response.json();
}
