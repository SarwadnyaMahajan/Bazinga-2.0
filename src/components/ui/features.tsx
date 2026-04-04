'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ArrowUp,
  CalendarCheck,
  FileCheck2,
  Globe,
  Layers3,
  Play,
  Plus,
  ShieldCheck,
  Signature,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react'

const MESCHAC_AVATAR = 'https://avatars.githubusercontent.com/u/47919550?v=4'
const BERNARD_AVATAR = 'https://avatars.githubusercontent.com/u/31113941?v=4'
const THEO_AVATAR = 'https://avatars.githubusercontent.com/u/68236786?v=4'
const GLODIE_AVATAR = 'https://avatars.githubusercontent.com/u/99137927?v=4'

const featureCardClassName =
  'rounded-[24px] border border-white/8 bg-[#3E3A39] text-white shadow-[0_24px_60px_rgba(10,10,10,0.10)]'

const insetCardClassName =
  'rounded-[18px] border border-white/6 bg-[#0F0F10] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-[56rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_62%)] blur-3xl"
      />
      <div className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-[#0A0A0A]"></span>
              <span className="font-serif text-xl italic text-[#4A4A4A]">Product</span>
            </div>
            <h2 className="max-w-3xl text-balance font-serif text-4xl font-medium tracking-[-0.03em] text-[#0A0A0A] sm:text-5xl lg:text-6xl">
              Systems built to move claims faster without losing control.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[#6A6A6A] sm:text-[19px]">
              Every workflow is designed for insurance teams that need speed,
              auditability, and calm operations at scale across intake,
              adjudication, and follow-up.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Card
              className={cn(
                featureCardClassName,
                'overflow-hidden p-7 md:col-span-2 xl:col-span-3'
              )}
            >
              <Target className="size-5 text-[#F4F0E8]" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-[#F7F4EF]">
                Instant claim triage
              </h3>
              <p className="mt-3 max-w-xl text-balance text-[16px] leading-8 text-[#B8B2AC]">
                Route FNOL submissions, classify urgency, and surface missing
                evidence before a human ever opens the file.
              </p>

              <MeetingIllustration />
            </Card>

            <Card
              className={cn(
                featureCardClassName,
                'group overflow-hidden p-7 md:col-span-2 xl:col-span-3'
              )}
            >
              <Workflow className="size-5 text-[#F4F0E8]" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-[#F7F4EF]">
                Review flows that stay in motion
              </h3>
              <p className="mt-3 max-w-xl text-balance text-[16px] leading-8 text-[#B8B2AC]">
                Coordinate assessors, adjusters, and fraud ops in a single
                decision track with visible ownership at every step.
              </p>

              <CodeReviewIllustration />
            </Card>

            <Card
              className={cn(
                featureCardClassName,
                'group overflow-hidden p-7 md:col-span-1 xl:col-span-2'
              )}
            >
              <Sparkles className="size-5 text-[#F4F0E8]" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-[#F7F4EF]">
                Context-aware assistant
              </h3>
              <p className="mt-3 text-balance text-[16px] leading-8 text-[#B8B2AC]">
                Ask questions in plain language and get answers grounded in the
                live claim, policy, and prior correspondence.
              </p>

              <div className="overflow-hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent)]">
                <AIAssistantIllustration />
              </div>
            </Card>

            <Card
              className={cn(
                featureCardClassName,
                'overflow-hidden p-7 md:col-span-1 xl:col-span-2'
              )}
            >
              <ShieldCheck className="size-5 text-[#F4F0E8]" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-[#F7F4EF]">
                Compliance by default
              </h3>
              <p className="mt-3 text-balance text-[16px] leading-8 text-[#B8B2AC]">
                Decision logs, escalation rules, and regulatory checks are
                captured automatically as part of every claim action.
              </p>

              <ComplianceIllustration />
            </Card>

            <Card
              className={cn(
                featureCardClassName,
                'overflow-hidden p-7 md:col-span-2 xl:col-span-2'
              )}
            >
              <Layers3 className="size-5 text-[#F4F0E8]" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-[#F7F4EF]">
                Built for layered operations
              </h3>
              <p className="mt-3 text-balance text-[16px] leading-8 text-[#B8B2AC]">
                Connect claims intake, internal approvals, vendors, and payout
                systems without forcing teams into a rigid one-size process.
              </p>

              <OperationsIllustration />
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

const MeetingIllustration = () => {
  return (
    <Card
      aria-hidden
      className={cn(insetCardClassName, 'mt-10 aspect-[1.45/1] p-5 sm:p-6')}
    >
      <div className="mb-0.5 text-sm font-semibold text-[#F7F4EF]">
        Triage review queue
      </div>
      <div className="mb-4 flex gap-2 text-sm">
        <span className="text-[#A79F98]">14 priority claims ready</span>
      </div>
      <div className="mb-2 flex -space-x-1.5">
        <div className="flex -space-x-1.5">
          {[
            { src: MESCHAC_AVATAR, alt: 'Meschac Irung' },
            { src: BERNARD_AVATAR, alt: 'Bernard Ngandu' },
            { src: THEO_AVATAR, alt: 'Theo Balick' },
            { src: GLODIE_AVATAR, alt: 'Glodie Lukose' },
          ].map((avatar) => (
            <div
              key={avatar.alt}
              className="size-7 rounded-full border border-white/10 bg-[#181819] p-0.5 shadow shadow-black/20"
            >
              <img
                className="aspect-square rounded-full object-cover"
                src={avatar.src}
                alt={avatar.alt}
                height="460"
                width="460"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/6 bg-white/4 p-3">
          <div className="text-xs uppercase tracking-[0.18em] text-[#8F8781]">
            Auto-approved
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#F7F4EF]">68%</div>
        </div>
        <div className="rounded-2xl border border-white/6 bg-white/4 p-3">
          <div className="text-xs uppercase tracking-[0.18em] text-[#8F8781]">
            Needs review
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#F7F4EF]">32%</div>
        </div>
      </div>
    </Card>
  )
}

const CodeReviewIllustration = () => {
  return (
    <div aria-hidden className="relative mt-10 min-h-56">
      <Card
        className={cn(
          insetCardClassName,
          'aspect-[1.4/1] w-[82%] translate-y-4 p-4 transition-transform duration-200 ease-in-out group-hover:-rotate-3'
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="size-6 rounded-full border border-white/10 bg-[#181819] p-0.5 shadow shadow-black/20">
            <img
              className="aspect-square rounded-full object-cover"
              src={MESCHAC_AVATAR}
              alt="M Irung"
              height="460"
              width="460"
            />
          </div>
          <span className="text-sm font-medium text-[#C4BCB6]">Meschac Irung</span>

          <span className="text-xs text-[#857E78]">2m</span>
        </div>

        <div className="ml-8 space-y-2">
          <div className="h-2 rounded-full bg-white/10"></div>
          <div className="h-2 w-4/5 rounded-full bg-white/10"></div>
          <div className="h-2 w-3/5 rounded-full bg-white/10"></div>
        </div>

        <div className="ml-8 mt-4 flex items-center gap-2 text-sm text-[#B8B2AC]">
          <Signature className="size-5 text-[#F3E8D2]" />
          Missing photo evidence flagged
        </div>
      </Card>
      <Card
        className={cn(
          insetCardClassName,
          'aspect-[3/5] absolute -top-3 right-0 flex w-[38%] translate-y-4 p-2 transition-transform duration-200 ease-in-out group-hover:rotate-3'
        )}
      >
        <div className="m-auto flex size-10 rounded-full bg-white/8">
          <Play className="m-auto size-4 fill-[#CFC6BD] stroke-[#CFC6BD]" />
        </div>
      </Card>
    </div>
  )
}

const AIAssistantIllustration = () => {
  return (
    <Card
      aria-hidden
      className={cn(
        insetCardClassName,
        'mt-10 aspect-[1.45/1] translate-y-4 p-5 pb-6 transition-transform duration-200 group-hover:translate-y-0'
      )}
    >
      <div className="w-fit">
        <Sparkles className="size-3.5 fill-[#C9B0F8] stroke-[#C9B0F8]" />
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#F5F1EB]">
          Summarize the policy exclusions relevant to this windshield claim and
          draft next steps for the adjuster.
        </p>
      </div>
      <div className="-mx-3 -mb-3 mt-3 space-y-3 rounded-lg bg-white/6 p-3">
        <div className="text-sm text-[#B8B2AC]">Ask AI Assistant</div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl border-white/10 bg-transparent text-[#D7D0C9] shadow-none hover:bg-white/8 hover:text-white"
            >
              <Plus />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl border-white/10 bg-transparent text-[#D7D0C9] shadow-none hover:bg-white/8 hover:text-white"
            >
              <Globe />
            </Button>
          </div>

          <Button
            size="icon"
            className="size-7 rounded-2xl bg-[#F97316] text-white hover:bg-[#EA580C]"
          >
            <ArrowUp strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

const ComplianceIllustration = () => {
  return (
    <Card
      aria-hidden
      className={cn(insetCardClassName, 'mt-10 space-y-4 p-5')}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[#F7F4EF]">
            Decision safeguards
          </div>
          <div className="mt-1 text-sm text-[#8F8781]">
            California bodily injury claim
          </div>
        </div>
        <FileCheck2 className="size-5 text-[#F3E8D2]" />
      </div>
      <div className="space-y-3">
        {[
          'Policy effective dates verified',
          'Coverage threshold confirmed',
          'Escalation trigger logged to audit trail',
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/4 px-3 py-3"
          >
            <span className="size-2 rounded-full bg-[#F97316]" />
            <span className="text-sm text-[#D6CFC8]">{item}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

const OperationsIllustration = () => {
  return (
    <Card
      aria-hidden
      className={cn(insetCardClassName, 'mt-10 overflow-hidden p-5')}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#F7F4EF]">
          Cross-team workflow
        </div>
        <CalendarCheck className="size-4 text-[#F3E8D2]" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { title: 'FNOL', value: '04m' },
          { title: 'Review', value: '12m' },
          { title: 'Payout', value: '1d' },
        ].map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-white/6 bg-white/4 p-3"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-[#8F8781]">
              {step.title}
            </div>
            <div className="mt-2 text-xl font-semibold text-[#F7F4EF]">
              {step.value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/8">
        <div className="h-2 w-[72%] rounded-full bg-[#F97316]" />
      </div>
      <div className="mt-3 text-sm text-[#B8B2AC]">
        Median time to resolution across the active claims pipeline.
      </div>
    </Card>
  )
}
