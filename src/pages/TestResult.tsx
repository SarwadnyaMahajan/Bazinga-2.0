import { useState } from "react";
import { SubmissionResult,type STPDecision } from "@/components/SubmissionResult";

export default function TestResult() {
  const [decision, setDecision] = useState<STPDecision>("MANUAL_REVIEW");

  // Mock data for the states
  const mockData = {
    AUTO_APPROVE: {
      message: "Your claim has been successfully processed and approved. The funds will be transferred to your account within 24 hours.",
      reasoning: "The claimed damage of $432.00 is well below the policy limit of $10,000 for body panels. The evidence submitted clearly matches the description of a door dent. Auto-approval thresholds met flawlessly."
    },
    MANUAL_REVIEW: {
      message: "Claim is under manual review. You will be notified within 24-48 hours.",
      reasoning: "The claim is for a door outer dent, which is a covered damage type. The estimated amount of $432.00 is below the limit. However, the user description is unclear and the detected item only partially matches the policy. Routing for human review."
    },
    REJECT: {
      message: "Your claim has been declined after automated assessment.",
      reasoning: "The policy explicitly excludes damage caused by off-roading. The evidence provided and the user description confirm the vehicle was used off-road at the time of the incident."
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] p-8">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      <div className="absolute top-8 left-0 right-0 flex justify-center gap-4 z-50">
        <select 
          className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm font-medium"
          value={decision} 
          onChange={(e) => setDecision(e.target.value as STPDecision)}
        >
          <option value="AUTO_APPROVE">Auto-Approved</option>
          <option value="MANUAL_REVIEW">Manual Review</option>
          <option value="REJECT">Rejected</option>
        </select>
      </div>

      {/* Main Container mapping back to exactly how the dashboard handles it */}
      <div className="relative w-full max-w-4xl z-10 pt-16">
        <SubmissionResult 
          decision={decision}
          message={mockData[decision].message}
          reasoning={mockData[decision].reasoning}
          onReset={() => alert("Reset clicked!")}
        />
      </div>
    </div>
  );
}
