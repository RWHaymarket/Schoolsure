import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function CoffeeCTA() {
  return (
    <section className="bg-navy py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magenta/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-magenta/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          You spend more insuring your car
          <span className="block text-magenta mt-2">
            than protecting your child&apos;s education.
          </span>
        </h2>

        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-14">
          Cover designed to protect your child's education.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-14 max-w-4xl mx-auto">
          <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-left">
            <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Foundation</p>
            <p className="text-4xl font-black text-white mb-1">
              $10<span className="text-lg font-semibold text-white/50">/wk</span>
            </p>
            <p className="text-sm text-white/40 mb-5">for fees around $15k/year</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Parent continuity cover</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Paid direct to school</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Inflation-linked</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.12] backdrop-blur-sm rounded-2xl p-8 border border-magenta/30 text-left ring-1 ring-magenta/20 relative">
            <div className="absolute -top-3 left-8 px-3 py-1 bg-magenta rounded-full">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Most popular</span>
            </div>
            <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Signature</p>
            <p className="text-4xl font-black text-white mb-1">
              $17<span className="text-lg font-semibold text-white/50">/wk</span>
            </p>
            <p className="text-sm text-white/40 mb-5">for fees around $25k/year</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Parent continuity cover</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Student cover included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Deposit protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Mental health cover</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-left">
            <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Prestige</p>
            <p className="text-4xl font-black text-white mb-1">
              $24<span className="text-lg font-semibold text-white/50">/wk</span>
            </p>
            <p className="text-sm text-white/40 mb-5">for fees around $35k/year</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Full parent cover</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Full student cover</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Enhanced single-parent limits</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-magenta" />
                <span className="text-sm text-white/60">Full-term death benefit</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Cover is subject to policy terms, conditions, and exclusions. Please read the Product Disclosure Statement before purchasing.
        </p>

        {/* TODO: Update weekly prices when premium rates confirmed */}

        <Link
          href="/quote/school"
          className="inline-flex items-center gap-2 px-10 py-4 bg-magenta hover:bg-magenta-dark text-white font-semibold text-lg rounded-xl transition-all shadow-lg shadow-magenta/30"
        >
          See Your Exact Price
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-sm text-white/30 mt-6">
          Based on your school&apos;s actual fees · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
