import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getReviewQueue, submitCarClaim, submitTravelClaim } from "@/lib/api";
import type { ReviewQueueItem, SubmitResponse } from "@/lib/api";
import { 
  Files, 
  Bell, 
  UserCircle,
  Plus,
  CheckCircle,
  XCircle,
  CircleNotch,
  User,
  ArrowRight
} from "@phosphor-icons/react";

const CAR_DAMAGE_OPTIONS = [
  { value: "bonnet-dent", label: "Bonnet Dent", category: "Body panels" },
  { value: "doorouter-dent", label: "Door Outer Dent", category: "Body panels" },
  { value: "doorouter-paint-trace", label: "Door Outer Paint Trace", category: "Paint and surface" },
  { value: "doorouter-scratch", label: "Door Outer Scratch", category: "Paint and surface" },
  { value: "fender-dent", label: "Fender Dent", category: "Body panels" },
  { value: "front-bumper-dent", label: "Front Bumper Dent", category: "Bumpers" },
  { value: "front-bumper-scratch", label: "Front Bumper Scratch", category: "Bumpers" },
  { value: "Front-Windscreen-Damage", label: "Front Windscreen Damage", category: "Glass and lights" },
  { value: "Headlight-Damage", label: "Headlight Damage", category: "Glass and lights" },
  { value: "Major-Rear-Bumper-Dent", label: "Major Rear Bumper Dent", category: "Bumpers" },
  { value: "medium-Bodypanel-Dent", label: "Medium Body Panel Dent", category: "Body panels" },
  { value: "paint-chip", label: "Paint Chip", category: "Paint and surface" },
  { value: "paint-trace", label: "Paint Trace", category: "Paint and surface" },
  { value: "pillar-dent", label: "Pillar Dent", category: "Body panels" },
  { value: "quaterpanel-dent", label: "Quarter Panel Dent", category: "Body panels" },
  { value: "rear-bumper-dent", label: "Rear Bumper Dent", category: "Bumpers" },
  { value: "rear-bumper-scratch", label: "Rear Bumper Scratch", category: "Bumpers" },
  { value: "Rear-windscreen-Damage", label: "Rear Windscreen Damage", category: "Glass and lights" },
  { value: "roof-dent", label: "Roof Dent", category: "Body panels" },
  { value: "RunningBoard-Dent", label: "Running Board Dent", category: "Body panels" },
  { value: "Sidemirror-Damage", label: "Side Mirror Damage", category: "Glass and lights" },
  { value: "Signlight-Damage", label: "Signal Light Damage", category: "Glass and lights" },
  { value: "Taillight-Damage", label: "Taillight Damage", category: "Glass and lights" },
] as const;

import { SubmissionLoader } from "@/components/SubmissionLoader";
import { SubmissionResult } from "@/components/SubmissionResult";
import { SUBMISSION_STAGES } from "@/lib/constants";

const DAMAGE_CATEGORIES = ["Body panels", "Bumpers", "Paint and surface", "Glass and lights"] as const;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("new_claim"); // new_claim, review
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);

  // Form states
  const [claimType, setClaimType] = useState<"car" | "travel" | "">("");
  const [selectedDamage, setSelectedDamage] = useState<string>(CAR_DAMAGE_OPTIONS[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);

  useEffect(() => {
    if (!submitting || !claimType) {
      setSubmissionStage(0);
      return;
    }

    const stages = SUBMISSION_STAGES[claimType];
    const interval = window.setInterval(() => {
      setSubmissionStage((current) => (current + 1) % stages.length);
    }, 1400);

    return () => window.clearInterval(interval);
  }, [claimType, submitting]);

  // Fetch admin review queue from backend
  const fetchQueue = async () => {
    setLoadingQueue(true);
    try {
      const data = await getReviewQueue();
      setReviewQueue(data || []);
    } catch (err) {
      console.error("Failed to fetch review queue", err);
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!claimType) return;
    
    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      let res: SubmitResponse;
      if (claimType === "car") {
        res = await submitCarClaim(formData);
      } else {
        res = await submitTravelClaim(formData);
      }
      setSubmitResult(res);
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setClaimType("");
    setSelectedDamage(CAR_DAMAGE_OPTIONS[0].value);
    setSubmitResult(null);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0A0A0A] flex pb-16 md:pb-0 font-sans selection:bg-[#F97316] selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E8E6E1] bg-[#FDFBF7] sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2">
            <div className="w-5 h-5 border-[1.5px] border-[#0A0A0A] relative flex items-center justify-center">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 border-l-[1.5px] border-b-[1.5px] border-[#0A0A0A]"></div>
            </div>
            <Link to="/" className="text-[17px] font-medium tracking-tight hover:underline">Veridium STP</Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4">
          <button 
            onClick={() => { setActiveTab("new_claim"); resetForm(); }}
            className={`flex items-center gap-2.5 px-3 py-2 font-medium w-full text-left transition-colors rounded-xl text-[14px] ${
              activeTab === "new_claim" ? "bg-white text-[#0A0A0A] shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-[#E8E6E1]" : "bg-transparent text-[#6A6A6A] hover:bg-white/50 border border-transparent hover:border-[#E8E6E1]/50"
            }`}
          >
            <Plus size={16} weight={activeTab === "new_claim" ? "bold" : "regular"} /> New Claim
          </button>
          <button 
            onClick={() => { setActiveTab("review"); fetchQueue(); }}
            className={`flex items-center gap-2.5 px-3 py-2 font-medium w-full text-left transition-colors rounded-xl text-[14px] ${
              activeTab === "review" ? "bg-white text-[#0A0A0A] shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-[#E8E6E1]" : "bg-transparent text-[#6A6A6A] hover:bg-white/50 border border-transparent hover:border-[#E8E6E1]/50"
            }`}
          >
            <Files size={16} weight={activeTab === "review" ? "fill" : "regular"} /> Review Queue
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF9F6]">
        <header className="h-[72px] border-b border-[#E8E6E1] flex items-center justify-between px-4 sm:px-6 bg-[#FDFBF7] sticky top-0 z-10">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-5 h-5 border-[1.5px] border-[#0A0A0A] relative flex items-center justify-center">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 border-l-[1.5px] border-b-[1.5px] border-[#0A0A0A]"></div>
            </div>
            <Link to="/" className="text-[17px] font-medium tracking-tight hover:underline">Veridium STP</Link>
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            <Button size="icon" variant="ghost" className="rounded-full relative text-[#6A6A6A] hover:bg-white hover:text-[#0A0A0A] border border-transparent hover:border-[#E8E6E1]">
              <Bell size={20} weight="regular" />
              {reviewQueue.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-[#F97316] rounded-full"></span>}
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full relative text-[#6A6A6A] hover:bg-white hover:text-[#0A0A0A] border border-transparent hover:border-[#E8E6E1] hidden md:flex">
              <User size={20} weight="regular" />
            </Button>
            <div className="md:hidden">
                <UserCircle size={28} className="text-[#6A6A6A]" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto w-full max-w-4xl mx-auto">

          {/* NEW CLAIM TAB */}
          {activeTab === "new_claim" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-2 flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></span>
                    <span className="font-serif italic text-[#303030] text-base">Claims intake</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#0A0A0A] mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-[#E8E6E1]">
                    Submit a claim for STP evaluation
                </h2>
                
                {!submitResult ? (
                    <div className="space-y-10">
                        <div className="space-y-3">
                            <Label className="text-[#4A4A4A] text-sm font-medium">Claim type</Label>
                            <Select value={claimType} onValueChange={(val: any) => setClaimType(val || "")}>
                                <SelectTrigger className="w-full h-14 rounded-[20px] sm:rounded-full border border-[#E8E6E1] bg-white text-[15px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] focus:ring-[#0A0A0A]">
                                    <SelectValue placeholder="Choose car or travel..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-[#E8E6E1] shadow-xl">
                                    <SelectItem value="car" className="cursor-pointer text-[14px] font-medium py-3 rounded-xl m-1">Car Insurance</SelectItem>
                                    <SelectItem value="travel" className="cursor-pointer text-[14px] font-medium py-3 rounded-xl m-1">Travel Insurance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {submitError && (
                            <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] rounded-2xl text-[14px] flex items-center gap-3 font-medium">
                                <XCircle size={20} weight="fill" /> {submitError}
                            </div>
                        )}

                        {claimType === "car" && (
                            <form onSubmit={handleClaimSubmit} aria-busy={submitting} className="relative space-y-6 animate-in slide-in-from-top-4 overflow-hidden rounded-3xl border border-[#E8E6E1] bg-white p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] duration-500 sm:p-8">
                                {submitting && <SubmissionLoader claimType="car" stageIndex={submissionStage} />}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Full Name</Label>
                                        <Input name="claimant_name" required defaultValue="John Doe" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Email</Label>
                                        <Input name="claimant_email" type="email" required defaultValue="john@example.com" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4A4A4A] text-sm font-medium">Policy Number</Label>
                                    <Input name="policy_number" required defaultValue="POL_2024_001" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4A4A4A] text-sm font-medium">Incident Details</Label>
                                    <Input name="description" required placeholder="Describe what happened..." className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Estimated Cost (₹)</Label>
                                        <Input name="estimated_amount" type="number" step="0.01" required placeholder="500.00" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Damage Type</Label>
                                        <div className="inline-flex w-fit items-center rounded-full border border-[#E8E6E1] bg-[#F8F4ED] px-3 py-1 text-xs font-medium text-[#625A54]">
                                            Selected: {CAR_DAMAGE_OPTIONS.find((option) => option.value === selectedDamage)?.label}
                                        </div>
                                    </div>
                                    <input type="hidden" name="selected_damage" value={selectedDamage} />

                                    <div className="rounded-[28px] border border-[#E8E6E1] bg-[#FCFAF7] p-4 sm:p-5">
                                        <div className="space-y-4">
                                            {DAMAGE_CATEGORIES.map((category) => (
                                                <div key={category}>
                                                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A8179]">
                                                        {category}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {CAR_DAMAGE_OPTIONS.filter((option) => option.category === category).map((option) => {
                                                            const isActive = selectedDamage === option.value;

                                                            return (
                                                                <button
                                                                    key={option.value}
                                                                    type="button"
                                                                    onClick={() => setSelectedDamage(option.value)}
                                                                    className={`rounded-2xl border px-3 py-2 text-left text-[13px] font-medium transition-all sm:text-[14px] ${
                                                                        isActive
                                                                            ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-[0_8px_18px_rgba(10,10,10,0.12)]"
                                                                            : "border-[#E8E6E1] bg-white text-[#3E3A37] hover:border-[#CFC3B4] hover:bg-[#F8F4ED]"
                                                                    }`}
                                                                    aria-pressed={isActive}
                                                                >
                                                                    {option.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4A4A4A] text-sm font-medium">Evidence Photo</Label>
                                    <Input name="evidence" type="file" required accept="image/*" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] flex items-center file:bg-white file:text-[#0A0A0A] file:border file:border-[#E8E6E1] file:rounded-md file:px-3 file:py-1 file:mr-3 file:text-[13px] file:font-medium p-[3px] text-sm text-[#4A4A4A] cursor-pointer" />
                                </div>

                                <div className="pt-4">
                                    <Button disabled={submitting} type="submit" className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white h-12 rounded-full font-medium text-[15px] transition-transform active:scale-[0.98] shadow-sm border-none">
                                        {submitting ? "Preparing submission" : <>Submit car claim <ArrowRight className="ml-1.5" size={16} /></>}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {claimType === "travel" && (
                            <form onSubmit={handleClaimSubmit} aria-busy={submitting} className="relative space-y-6 animate-in slide-in-from-top-4 overflow-hidden rounded-3xl border border-[#E8E6E1] bg-white p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] duration-500 sm:p-8">
                                {submitting && <SubmissionLoader claimType="travel" stageIndex={submissionStage} />}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Full Name</Label>
                                        <Input name="claimant_name" required defaultValue="Jane Smith" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Email</Label>
                                        <Input name="claimant_email" type="email" required defaultValue="jane@example.com" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4A4A4A] text-sm font-medium">Policy Number</Label>
                                    <Input name="policy_number" required defaultValue="TRV_2024_002" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Trip Origin</Label>
                                        <Input name="trip_origin" required placeholder="JFK" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors uppercase" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Destination</Label>
                                        <Input name="trip_destination" required placeholder="LHR" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors uppercase" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Travel Date</Label>
                                        <Input name="travel_date" type="date" required className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors bg-white text-[#4A4A4A] px-4" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[#4A4A4A] text-sm font-medium">Cost Claim (₹)</Label>
                                        <Input name="estimated_amount" type="number" step="0.01" required placeholder="800.00" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4A4A4A] text-sm font-medium">Category</Label>
                                    <Select name="selected_category" required defaultValue="Flight Cancellation">
                                        <SelectTrigger className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus:ring-1 focus:ring-[#0A0A0A] focus:border-[#0A0A0A] transition-colors">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border border-[#E8E6E1] shadow-xl">
                                            <SelectItem value="Luggage Lost" className="rounded-xl m-1 font-medium">Luggage Lost</SelectItem>
                                            <SelectItem value="Flight Delay" className="rounded-xl m-1 font-medium">Flight Delay</SelectItem>
                                            <SelectItem value="Flight Cancellation" className="rounded-xl m-1 font-medium">Flight Cancellation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4A4A4A] text-sm font-medium">Description</Label>
                                    <Input name="description" required placeholder="e.g. Flight cancelled without notice" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4A4A4A] text-sm font-medium">Evidence Doc/Image</Label>
                                    <Input name="evidence" type="file" required accept="image/*,.pdf" className="h-[46px] rounded-xl border-[#E8E6E1] bg-[#FDFBF7] focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:border-[#0A0A0A] flex items-center file:bg-white file:text-[#0A0A0A] file:border file:border-[#E8E6E1] file:rounded-md file:px-3 file:py-1 file:mr-3 file:text-[13px] file:font-medium p-[3px] text-sm text-[#4A4A4A] cursor-pointer" />
                                </div>

                                <div className="pt-4">
                                    <Button disabled={submitting} type="submit" className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white h-12 rounded-full font-medium text-[15px] transition-transform active:scale-[0.98] shadow-sm border-none">
                                        {submitting ? "Preparing submission" : <>Submit travel claim <ArrowRight className="ml-1.5" size={16} /></>}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <SubmissionResult
                      decision={submitResult.stp_decision}
                      message={submitResult.message}
                      reasoning={submitResult.reasoning}
                      onReset={resetForm}
                    />
                )}
            </div>
          )}

          {/* ADMIN TAB */}
          {activeTab === "review" && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-2 flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></span>
                    <span className="font-serif italic text-[#303030] text-base">Human adjudication</span>
                </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E6E1]">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#0A0A0A]">Manual review queue</h2>
                </div>
                <Button onClick={fetchQueue} variant="outline" className="h-[38px] rounded-full border-[#E8E6E1] bg-white text-[#0A0A0A] hover:bg-[#FAF9F6] font-medium text-[13px]">
                  Refresh list
                </Button>
              </div>

              {loadingQueue ? (
                <div className="flex items-center justify-center py-20">
                  <CircleNotch className="animate-spin text-[#0A0A0A]" size={36} />
                </div>
              ) : reviewQueue.length === 0 ? (
                  <Card className="bg-white border-[#E8E6E1] border-dashed rounded-3xl shadow-sm p-8 sm:p-12">
                  <CardContent className="flex flex-col items-center justify-center text-center p-0">
                    <CheckCircle size={48} className="text-[#D0D0D0] mb-4" />
                    <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2 tracking-tight">Queue clear</h3>
                    <p className="text-[#6A6A6A] font-medium max-w-xs">No claims currently require manual adjudication.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviewQueue.map((item) => (
                    <Card key={item.claim_id} className="bg-white border-[#E8E6E1] rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.02)] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex flex-col md:flex-row md:items-stretch">
                        <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-[#E8E6E1] bg-white">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                <span className="inline-flex px-2 py-1 rounded-md text-[11px] font-semibold text-[#4A4A4A] bg-[#F3F1EC] mb-2">
                                  {item.claim_type.toUpperCase()}
                                </span>
                                <h3 className="text-lg font-mono font-medium tracking-tight text-[#0A0A0A] block">{item.claim_id}</h3>
                              </div>
                              <div className="text-right border border-[#E8E6E1] px-3 py-1.5 bg-[#FAF9F6] rounded-xl flex items-center gap-2">
                                <div className="text-[11px] font-semibold text-[#6A6A6A]">SCORE</div>
                                <div className="font-semibold text-[#0A0A0A] text-lg leading-none">{(item.final_score * 100).toFixed(0)}%</div>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 text-sm pt-4 border-t border-[#E8E6E1]/50">
                              <div>
                                <div className="text-[#8A8A8A] text-[12px] font-medium mb-1">Claimant</div>
                                <div className="font-medium text-[#0A0A0A]">{item.claimant_name}</div>
                              </div>
                              <div>
                                <div className="text-[#8A8A8A] text-[12px] font-medium mb-1">Policy</div>
                                <div className="font-medium text-[#0A0A0A] font-mono">{item.policy_number}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-[#8A8A8A] text-[12px] font-medium mb-1">Incident description</div>
                                <div className="text-[#4A4A4A] leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E6E1]">{item.description}</div>
                              </div>
                           </div>
                        </div>
                        <div className="p-6 md:w-64 bg-[#FAF9F6] flex items-center justify-center">
                          <span className="text-sm font-medium text-[#6A6A6A]">Pending review</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Mobile Bottom Navigation Area */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E8E6E1] flex justify-around items-center h-16 pb-safe text-[11px] font-medium text-[#6A6A6A] z-50">
        <button onClick={() => { setActiveTab("new_claim"); resetForm(); }} className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'new_claim' ? 'text-[#0A0A0A]' : 'hover:text-[#0A0A0A]'}`}>
            <Plus size={24} weight={activeTab === 'new_claim' ? 'bold' : 'regular'} />
            <span>Claims</span>
        </button>
        <button onClick={() => { setActiveTab("review"); fetchQueue(); }} className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'review' ? 'text-[#0A0A0A]' : 'hover:text-[#0A0A0A]'}`}>
            <Files size={24} weight={activeTab === 'review' ? 'fill' : 'regular'} />
            <span>Review</span>
        </button>
      </nav>
    </div>
  );
}
