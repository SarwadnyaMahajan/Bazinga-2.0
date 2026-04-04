import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SUBMISSION_STAGES } from "@/lib/constants";

export function SubmissionLoader({
  claimType,
  stageIndex,
}: {
  claimType: "car" | "travel";
  stageIndex: number;
}) {
  const stages = SUBMISSION_STAGES[claimType];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-xl p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-stone-200/60 bg-white/80 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-black/5"
      >
        {/* Subtle glow effect */}
        <div className="pointer-events-none absolute -inset-px rounded-[32px] opacity-50 transition-opacity duration-500">
          <div className="absolute inset-x-12 -top-px h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
          <div className="absolute -top-24 left-1/2 -ml-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
        </div>

        <div className="relative mb-10 flex min-h-[140px] items-center justify-center">
          {/* Core loader ring */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-stone-200" 
            />
            <motion.div 
               animate={{ rotate: -360 }}
               transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-stone-200" 
            />
            
            {/* Spinning gradient border for the main ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-[30px] rounded-full border-2 border-transparent border-t-orange-500 border-r-orange-500/50 opacity-80"
            />
            
            {/* Center pulsing element */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 shadow-lg shadow-orange-500/20"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">Nova</span>
            </motion.div>
          </div>
        </div>

        {/* Header */}
        <div className="relative mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-stone-50 px-3 py-1 shadow-sm">
             <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600">
              STP active
            </span>
          </div>
          <h3 className="text-xl font-medium tracking-tight text-stone-900">
            Analyzing {claimType} claim
          </h3>
        </div>

        {/* Dynamic stages list */}
        <div className="relative space-y-4">
          <div className="absolute left-[11px] top-3 bottom-5 w-px bg-stone-200/80" />
          
          {stages.map((stage, idx) => {
            const isActive = idx === stageIndex;
            const isComplete = idx < stageIndex;

            return (
              <div key={stage} className="relative flex items-center gap-4">
                <div className="relative z-10 flex items-center justify-center bg-white/80 py-1">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white"
                    >
                      <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <div className="relative flex h-6 w-6 items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute h-full w-full rounded-full bg-orange-200"
                      />
                      <div className="relative h-2 w-2 rounded-full bg-orange-500" />
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-stone-50">
                      <div className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                    </div>
                  )}
                </div>
                
                <div className={`flex-1 transition-all duration-300 ${
                  isActive ? "translate-x-1" : "translate-x-0"
                }`}>
                   <p className={`text-sm font-medium ${
                     isComplete ? "text-stone-500" :
                     isActive ? "text-stone-900" :
                     "text-stone-400"
                   }`}>
                     {stage}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
