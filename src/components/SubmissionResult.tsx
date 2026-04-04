import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type STPDecision = "AUTO_APPROVE" | "MANUAL_REVIEW" | "REJECT";

interface SubmissionResultProps {
  decision: STPDecision;
  message: string;
  reasoning: string;
  onReset: () => void;
}

export function SubmissionResult({ decision, message, reasoning, onReset }: SubmissionResultProps) {
  
  const config = {
    AUTO_APPROVE: {
      icon: <Check size={32} className="text-white" strokeWidth={2.5} />,
      title: "Claim auto-approved",
      bgColor: "bg-emerald-500",
      shadow: "shadow-[0_4px_14px_rgba(16,185,129,0.25)]"
    },
    MANUAL_REVIEW: {
      icon: <span className="text-white font-bold text-[32px] leading-none mb-1">!</span>,
      title: "Sent to manual review",
      bgColor: "bg-amber-500",
      shadow: "shadow-[0_4px_14px_rgba(245,158,11,0.25)]"
    },
    REJECT: {
      icon: <X size={32} className="text-white" strokeWidth={2.5} />,
      title: "Claim rejected",
      bgColor: "bg-rose-500",
      shadow: "shadow-[0_4px_14px_rgba(244,63,94,0.25)]"
    }
  }[decision];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#E8E6E1] bg-white p-8 sm:p-12 sm:pt-14 shadow-sm">
        <div className="flex flex-col items-center text-center">
          
          {/* Minimalist Premium Icon */}
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor} ${config.shadow}`}>
            {config.icon}
          </div>

          {/* Heading and Message */}
          <h3 className="mb-3 text-[32px] font-semibold tracking-[-0.02em] text-[#0A0A0A]">
            {config.title}
          </h3>
          <p className="mx-auto mb-10 max-w-[420px] text-[15px] leading-[1.6] text-[#6A6A6A]">
            {message}
          </p>

          {/* AI Reasoning Block */}
          <div className="w-full rounded-2xl border border-[#E8E6E1] bg-[#FAF9F6] p-6 sm:p-8 text-left mb-8 shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
            <span className="mb-4 block text-[13px] font-medium text-[#6A6A6A]">
              AI Reasoning
            </span>
            <p className="text-[15px] leading-relaxed text-[#0A0A0A] font-serif">
              {reasoning}
            </p>
          </div>

          {/* Actions */}
          <Button 
            onClick={onReset}
            className="w-full h-14 rounded-full bg-[#0A0A0A] text-[15px] font-medium text-white transition-all hover:bg-[#202020] active:scale-[0.98] border-none"
          >
            Submit another claim 
          </Button>

        </div>
      </div>
    </motion.div>
  );
}
