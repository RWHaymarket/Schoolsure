import { Shield, ShieldCheck, Heart, ShieldAlert, HeartPulse, Clock, Users, Brain } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface CoverageTierCardProps {
  tier: "comprehensive" | "platinum";
  isSelected: boolean;
  onSelect: () => void;
  weeklyPrice: number;
  monthlyPrice: number;
  annualPrice: number;
}

const comprehensiveFeatures = [
  { icon: Heart, text: "Death of fee payer (100%)" },
  { icon: ShieldAlert, text: "Total permanent disability (100%)" },
  { icon: HeartPulse, text: "Critical illness (25 conditions)" },
  { icon: Clock, text: "Temporary disablement (6 months)" },
];

const platinumExtras = [
  { icon: HeartPulse, text: "50 critical illness conditions (vs 25)" },
  { icon: Clock, text: "12 months temp disability (vs 6)" },
  { icon: Users, text: "Divorce/separation cover" },
  { icon: Brain, text: "$2,000 family counselling benefit" },
];

export default function CoverageTierCard({
  tier,
  isSelected,
  onSelect,
  weeklyPrice,
  monthlyPrice,
  annualPrice,
}: CoverageTierCardProps) {
  const isPlatinum = tier === "platinum";
  const features = isPlatinum
    ? [...comprehensiveFeatures, ...platinumExtras]
    : comprehensiveFeatures;

  const Icon = isPlatinum ? ShieldCheck : Shield;

  return (
    <div
      className={`relative rounded-2xl border-2 bg-white p-7 transition-all duration-200 cursor-pointer shadow-[0_10px_30px_rgba(15,23,42,0.08)] ${
        isSelected
          ? isPlatinum
            ? "border-magenta shadow-[0_16px_40px_rgba(15,23,42,0.15)] ring-4 ring-magenta/10"
            : "border-navy shadow-[0_16px_40px_rgba(15,23,42,0.15)]"
          : isPlatinum
          ? "border-grey-200 hover:border-magenta/50 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)] hover:-translate-y-1"
          : "border-grey-200 hover:border-grey-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)] hover:-translate-y-1"
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
    >
      {isPlatinum ? (
        <div className="absolute -top-3 right-4">
          <span className="rounded-full bg-magenta px-3 py-1 text-xs font-semibold text-white shadow-sm">
            ★ Recommended
          </span>
        </div>
      ) : null}

      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isPlatinum ? "bg-magenta/10" : "bg-grey-100"
          }`}
        >
          <Icon className={`h-5 w-5 ${isPlatinum ? "text-magenta" : "text-navy"}`} />
        </div>
        <div>
          <p
            className={`text-xs font-medium uppercase tracking-wide ${
              isPlatinum ? "text-magenta" : "text-grey-500"
            }`}
          >
            {isPlatinum ? "Platinum" : "Comprehensive"}
          </p>
          <h3 className="text-xl font-bold text-navy">
            {isPlatinum ? "Maximum certainty" : "Solid protection"}
          </h3>
        </div>
      </div>

      <ul className="space-y-3 text-small text-grey-700">
        {features.map(({ icon: FeatureIcon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <FeatureIcon className="h-4 w-4 text-magenta flex-shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-grey-200 pt-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-navy">
            {formatCurrency(Math.round(weeklyPrice))}
          </span>
          <span className="text-grey-500">/week</span>
        </div>
        <p className="mt-1 text-sm text-grey-500">
          {formatCurrency(Math.round(monthlyPrice))}/month · {formatCurrency(Math.round(annualPrice))}/year
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-grey-500">
        <span>{isSelected ? "Selected" : "Tap to select"}</span>
        <span className="rounded-full border border-grey-200 px-2 py-0.5 text-[11px]">
          {isPlatinum ? "Best value" : "Core cover"}
        </span>
      </div>
    </div>
  );
}
