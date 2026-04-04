import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CaretLeft } from "@phosphor-icons/react";

export default function Signup() {
  return (
    <div className="min-h-screen flex text-[#0A0A0A] bg-[#FDFBF7] font-sans selection:bg-[#F97316] selection:text-white">
      <div className="hidden lg:flex w-1/2 relative bg-[#0A0A0A] items-center justify-center overflow-hidden order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(201,176,248,0.14),transparent_30%)]" />
        <div className="relative z-10 max-w-lg p-12 text-white">
          <div className="w-10 h-10 border-2 border-white relative flex items-center justify-center mb-10">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 border-l-2 border-b-2 border-white"></div>
           </div>
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 bg-[#F97316]"></span>
            <span className="font-serif italic text-[#D0CAC3] text-lg">Platform access</span>
          </div>
          <h1 className="text-5xl font-medium mb-6 tracking-tight leading-tight font-serif">
            Give your claims team a calmer operating layer.
          </h1>
          <p className="text-[#B7B0A7] text-lg font-medium leading-relaxed">
            Request access to the STP workspace for car and travel claims, including submission flows, review queues, and policy-aware decisioning.
          </p>
          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#D0CAC3]">Automated validation and scoring</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#D0CAC3]">Manual review when thresholds require it</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#D0CAC3]">Email and Telegram notification workflows</div>
          </div>
        </div>
      </div>

      {/* Left Panel - Form (Mobile fills screen) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 py-24 sm:px-8 sm:py-28 lg:p-12 relative min-h-screen order-1">
        <div className="w-full max-w-sm absolute left-5 top-6 sm:left-8 sm:top-8">
            <Link to="/" className="text-[#6A6A6A] hover:text-[#0A0A0A] flex items-center gap-1.5 transition-colors font-medium text-sm group">
                <CaretLeft className="group-hover:-translate-x-1 transition-transform" /> Back to home
            </Link>
        </div>
        
        <div className="w-full max-w-sm">
          <div className="text-left mb-10">
            <div className="lg:hidden flex items-center gap-2 mb-8">
                <div className="w-6 h-6 border-2 border-[#0A0A0A] relative flex items-center justify-center">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 border-l-2 border-b-2 border-[#0A0A0A]"></div>
                </div>
                <span className="text-xl font-medium tracking-tight">Veridium STP</span>
            </div>
            
            <div className="mb-2 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-[#F97316]"></span>
                <span className="font-serif italic text-[#303030] text-lg">Request access</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] mb-2">Set up your workspace</h2>
            <p className="text-[#6A6A6A] text-[16px] leading-7">
              Create reviewer access for the frontend that connects to your Insurance STP backend and manual review APIs.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#4A4A4A] text-sm font-medium">Team lead name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Jane Doe" 
                className="bg-white border-[#E8E6E1] text-[#0A0A0A] h-12 px-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] rounded-xl font-medium transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#4A4A4A] text-sm font-medium">Work email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ops@carrier.com" 
                className="bg-white border-[#E8E6E1] text-[#0A0A0A] h-12 px-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] rounded-xl font-medium transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#4A4A4A] text-sm font-medium">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-white border-[#E8E6E1] text-[#0A0A0A] h-12 px-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] rounded-xl font-medium transition-colors"
                required
              />
            </div>

            <Button asChild className="w-full h-12 mt-6 bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-medium rounded-full transition-transform active:scale-[0.98] shadow-sm border-none">
              <Link to="/dashboard">Create workspace <CaretLeft className="ml-1.5 rotate-180" size={16} /></Link>
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-[#6A6A6A] font-medium">
            Already reviewing claims with Nova?{" "}
            <Link to="/login" className="text-[#0A0A0A] hover:underline underline-offset-4 decoration-[#E8E6E1] hover:decoration-[#0A0A0A] transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
