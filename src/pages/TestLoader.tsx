import { useState, useEffect } from "react";
import { SubmissionLoader } from "@/components/SubmissionLoader";
import { SUBMISSION_STAGES } from "@/lib/constants";

export default function TestLoader() {
  const [claimType, setClaimType] = useState<"car" | "travel">("car");
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const stages = SUBMISSION_STAGES[claimType];
    const interval = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % stages.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [claimType]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-stone-100 p-8">
      {/* Background content to showcase the backdrop blur */}
      <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-stone-300 bg-stone-200" />
        ))}
      </div>

      <div className="absolute top-8 flex items-center gap-4 z-50">
        <label className="text-sm font-medium text-stone-700 mt-1 cursor-pointer">
          <input
            type="radio"
            name="claimType"
            value="car"
            checked={claimType === "car"}
            onChange={() => {
              setClaimType("car");
              setStageIndex(0);
            }}
            className="mr-2 accent-orange-500"
          />
          Car Claim
        </label>
        <label className="text-sm font-medium text-stone-700 mt-1 cursor-pointer">
          <input
            type="radio"
            name="claimType"
            value="travel"
            checked={claimType === "travel"}
            onChange={() => {
              setClaimType("travel");
              setStageIndex(0);
            }}
            className="mr-2 accent-orange-500"
          />
          Travel Claim
        </label>
      </div>

      <div className="relative w-full max-w-4xl h-[600px] border border-stone-200 bg-white shadow-sm rounded-[40px] overflow-hidden">
        <SubmissionLoader claimType={claimType} stageIndex={stageIndex} />
      </div>
    </div>
  );
}