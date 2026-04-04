'use client'

import {
  BellRing,
  Camera,
  FileSearch,
  ShieldCheck,
} from 'lucide-react'

const steps = [
  {
    id: 'submit',
    eyebrow: 'Step 01',
    title: 'Claim enters with evidence attached',
    description:
      'Customers submit car or travel claims with policy details, incident context, and supporting files in one pass.',
    signal: 'Car + Travel intake',
    outcome: 'Submission captured',
    icon: Camera,
  },
  {
    id: 'score',
    eyebrow: 'Step 02',
    title: 'Nova validates policy and computes confidence',
    description:
      'Documents are parsed, fields are checked against policy context, and the claim is scored through the STP pipeline.',
    signal: 'Scored in seconds',
    outcome: 'Automation decision ready',
    icon: FileSearch,
  },
  {
    id: 'review',
    eyebrow: 'Step 03',
    title: 'Exceptions move into reviewer control',
    description:
      'Low-confidence, higher-value, or suspicious claims are routed with rationale, evidence gaps, and prior signals visible.',
    signal: 'Human-in-the-loop',
    outcome: 'Escalation tracked',
    icon: ShieldCheck,
  },
  {
    id: 'notify',
    eyebrow: 'Step 04',
    title: 'Decision closes the loop cleanly',
    description:
      'Approved and rejected claims are finalized with a traceable outcome and notification support across downstream channels.',
    signal: 'SMTP + Telegram',
    outcome: 'Claim resolved',
    icon: BellRing,
  },
] as const

const proofPoints = [
  {
    label: 'Straight-through path',
    value: '68%',
    detail: 'of routine claims can clear without manual touch.',
  },
  {
    label: 'Reviewer escalation',
    value: '32%',
    detail: 'of edge cases move into a controlled decision queue.',
  },
  {
    label: 'Decision context',
    value: 'Full trail',
    detail: 'policy checks, score rationale, and override history stay attached.',
  },
] as const

function WorkflowStep({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  const Icon = step.icon

  return (
    <article className="relative rounded-[28px] border border-[#E7DDD0] bg-white/85 p-6 shadow-[0_18px_50px_rgba(10,10,10,0.05)] backdrop-blur-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0A0A] text-white">
            <Icon className="size-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#8B8178]">
              {step.eyebrow}
            </div>
            <h3 className="mt-2 max-w-md text-2xl font-semibold tracking-[-0.02em] text-[#161412]">
              {step.title}
            </h3>
          </div>
        </div>

        <div className="hidden rounded-full border border-[#E7DDD0] bg-[#F8F2E9] px-3 py-1 text-xs text-[#5D544D] sm:block">
          {step.signal}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <p className="text-[16px] leading-8 text-[#625A54]">{step.description}</p>

        <div className="rounded-[22px] border border-[#EEE4D7] bg-[#FBF7F1] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#93887F]">
            Stage 0{index + 1}
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#E9DED2]">
            <div
              className="h-2 rounded-full bg-[#F97316]"
              style={{ width: `${46 + index * 16}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-[#625A54]">
            <span>Outcome</span>
            <span className="font-medium text-[#161412]">{step.outcome}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function WorkflowSection() {
  return (
    <section id="claims" className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-6 h-56 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_62%)] blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[36px] border border-[#E7DDD0] bg-[linear-gradient(180deg,#F9F2E8_0%,#FDFBF7_38%,#F8F2EA_100%)] px-6 py-10 shadow-[0_24px_80px_rgba(10,10,10,0.05)] sm:px-8 sm:py-12 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-[#0A0A0A]"></span>
              <span className="font-serif text-xl italic text-[#4A4A4A]">Workflow</span>
            </div>
            <h2 className="max-w-2xl font-serif text-4xl font-medium tracking-[-0.03em] text-[#0A0A0A] sm:text-5xl lg:text-6xl">
              From intake to settlement, every handoff stays legible.
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-8 text-[#625A54] sm:text-[19px]">
              The product works best when the claim path is obvious: automate the routine work, surface risk early, and keep reviewer control where it matters.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {proofPoints.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-[#E7DDD0] bg-white/80 p-5 shadow-[0_14px_36px_rgba(10,10,10,0.04)]"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8B8178]">
                  {item.label}
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#161412]">
                  {item.value}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#625A54]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <div
            aria-hidden
            className="absolute left-6 right-6 top-7 hidden h-px bg-[linear-gradient(90deg,rgba(231,221,208,0),rgba(231,221,208,1),rgba(231,221,208,0)) lg:block"
          />
          <div className="grid gap-5">
            {steps.map((step, index) => (
              <WorkflowStep key={step.id} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
