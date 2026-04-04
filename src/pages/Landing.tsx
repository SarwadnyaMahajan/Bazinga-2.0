import Hero from "@/components/hero";
import Features from "@/components/ui/features";
import WorkflowSection from "@/components/workflow";
import {
    BadgeCheck,
    Clock3,
    Play,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { InstagramLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#0A0A0A] font-sans selection:bg-[#F97316] selection:text-white flex flex-col">
            <Hero />

            <main className="flex-1 flex flex-col">
                    {/* <DemoOne /> */}


                <section id="platform" className="mx-auto w-full max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 lg:pb-32">
                    <Features />
                </section>

                <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8 lg:pb-32">
                    <WorkflowSection />
                </section>

                <section id="faq" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                        <div>
                            <div className="mb-6 flex items-center gap-2">
                                <span className="h-2.5 w-2.5 bg-[#0A0A0A]"></span>
                                <span className="font-serif text-xl italic text-[#4A4A4A]">FAQ</span>
                            </div>
                            <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#0A0A0A] sm:text-4xl lg:text-5xl">
                                Questions teams ask before switching.
                            </h2>
                            <p className="mt-5 max-w-md text-[17px] leading-8 text-[#6A6A6A]">
                                The platform is designed for operators who need faster decisions without losing oversight, auditability, or implementation control.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    question: "How long does implementation usually take?",
                                    answer:
                                        "Most teams start with one claims workflow and reach a live pilot in a few weeks. We typically begin with intake, triage rules, and one review path before expanding into payouts and broader operations.",
                                },
                                {
                                    question: "Can Nova work with our current policy and claims systems?",
                                    answer:
                                        "Yes. Nova is intended to sit alongside your existing stack. It can orchestrate decisions across claims platforms, document stores, internal tooling, and vendor systems without requiring a full rip-and-replace migration.",
                                },
                                {
                                    question: "How do you handle compliance and audit requirements?",
                                    answer:
                                        "Every action can be logged with decision context, escalation history, and policy references. That means your team gets a traceable audit trail for reviews, overrides, and automated outcomes by default.",
                                },
                                {
                                    question: "Do we keep humans in the loop for sensitive claims?",
                                    answer:
                                        "Yes. You can configure thresholds for manual review, route exceptions to specialist teams, and require approvals for high-risk or high-value decisions while still automating the straightforward cases.",
                                },
                            ].map((item) => (
                                <details
                                    key={item.question}
                                    className="group rounded-[24px] border border-[#E7DDD0] bg-white/70 px-5 py-5 shadow-[0_10px_30px_rgba(10,10,10,0.04)] backdrop-blur-sm sm:px-6"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-[#161412] marker:content-none sm:gap-6 sm:text-lg">
                                        <span>{item.question}</span>
                                        <span className="text-2xl leading-none text-[#F97316] transition-transform duration-200 group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <p className="pt-4 text-[16px] leading-8 text-[#6A6A6A]">
                                        {item.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <footer id="contact" className="relative mt-auto overflow-hidden bg-[#F6ECDD] px-4 pb-10 pt-8 text-[#0A0A0A] sm:px-6 lg:px-8">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_20%_40%,rgba(231,203,183,0.9),transparent_38%),radial-gradient(circle_at_60%_60%,rgba(244,196,122,0.35),transparent_34%),radial-gradient(circle_at_82%_30%,rgba(208,182,219,0.4),transparent_28%)]"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute bottom-[-2rem] left-[-5%] h-48 w-[62%] rounded-[100%] bg-[#E6D0C8]/75 blur-[2px]"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute bottom-[-3rem] right-[-8%] h-52 w-[72%] rounded-[100%] bg-[#D8C2D2]/45 blur-[2px]"
                    />

                    <div className="relative mx-auto max-w-6xl">
                        <div className="rounded-[30px] bg-[#343231] px-5 py-10 text-center text-white shadow-[0_20px_70px_rgba(10,10,10,0.16)] sm:px-8 sm:py-12 lg:px-10 lg:py-14">
                            <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#F7F4EF] sm:text-4xl lg:text-5xl">
                                Ready to modernize claims?
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-8 text-[#B7B0A7]">
                                Move from fragmented workflows to a single operating layer for triage, review, and compliant resolution.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                                <a
                                    href="#"
                                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[15px] font-medium text-[#1E1D1C] transition-colors hover:bg-[#F1ECE5]"
                                >
                                    Get started
                                </a>
                                <a
                                    href="#"
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/3 px-6 py-3 text-[15px] font-medium text-[#F3EEE7] transition-colors hover:bg-white/8"
                                >
                                    Contact our team
                                </a>
                            </div>

                            <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-[#B7B0A7] sm:flex-row sm:flex-wrap">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-4 text-[#D8C2D2]" />
                                    <span>Policy-aware automation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock3 className="size-4 text-[#D8C2D2]" />
                                    <span>Fast deployment cycles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-4 text-[#D8C2D2]" />
                                    <span>Audit-ready decision trails</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 border-t border-dashed border-[#B7AA97] pt-7">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#C9B0F8_0%,#F7D489_100%)]">
                                        <span className="text-sm font-semibold text-[#2E2A2A]">ns</span>
                                    </div>
                                    <span className="text-lg font-medium tracking-tight text-[#2C2926]">Veridium STP</span>
                                </div>

                                <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-[#4B4540] lg:justify-center">
                                    <a href="#platform" className="transition-colors hover:text-[#0A0A0A]">Platform</a>
                                    <a href="#claims" className="transition-colors hover:text-[#0A0A0A]">Claims</a>
                                    <a href="#faq" className="transition-colors hover:text-[#0A0A0A]">FAQ</a>
                                    <a href="#security" className="transition-colors hover:text-[#0A0A0A]">Security</a>
                                    <a href="/login" className="transition-colors hover:text-[#0A0A0A]">Reviewer Login</a>
                                    <a href="/signup" className="transition-colors hover:text-[#0A0A0A]">Request Access</a>
                                </nav>

                                <div className="flex items-center gap-4 text-[#0A0A0A]">
                                    <a href="#" className="transition-opacity hover:opacity-70" aria-label="X">
                                        <XLogo size={20} weight="fill" />
                                    </a>
                                    <a href="#" className="transition-opacity hover:opacity-70" aria-label="LinkedIn">
                                        <LinkedinLogo size={20} weight="fill" />
                                    </a>
                                    <a href="#" className="transition-opacity hover:opacity-70" aria-label="Instagram">
                                        <InstagramLogo size={20} weight="fill" />
                                    </a>
                                    <a href="#" className="transition-opacity hover:opacity-70" aria-label="Video">
                                        <Play className="size-5 fill-current" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 border-t border-dashed border-[#B7AA97] pt-7">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                <div id="security" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-[#4B4540]">
                                    <a href="#" className="transition-colors hover:text-[#0A0A0A]">Terms of service</a>
                                    <a href="#" className="transition-colors hover:text-[#0A0A0A]">Privacy Policy</a>
                                    <a href="#" className="transition-colors hover:text-[#0A0A0A]">Security</a>
                                    <a href="#" className="transition-colors hover:text-[#0A0A0A]">Status</a>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-[#2F2A27]">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#4892D8] bg-[#8BC0F3]/80 text-[11px] font-semibold">
                                        SOC 2
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#8A88A9] bg-[#D0CBE8]/75 text-[10px] font-semibold">
                                        ISO
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#4E68AA] bg-[#667FC5]/85 text-[10px] font-semibold text-white">
                                        GDPR
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#B68A4D] bg-[#E4BE78]/85 text-[10px] font-semibold">
                                        HIPAA
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#4B4540] sm:pl-2">
                                        <BadgeCheck className="size-4 text-[#0A0A0A]" />
                                        <span>© 2026 Veridium STP. All rights reserved.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
