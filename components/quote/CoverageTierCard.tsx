import { Shield, Heart, ShieldAlert, HeartPulse, Clock } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

interface CoverageTierCardProps {
  isSelected: boolean;
  onSelect: () => void;
  weeklyPrice: number;
  monthlyPrice: number;
  annualPrice: number;
}

const parentContinuityFeatures = [
  { icon: Heart, text: "Death of fee payer" },
  { icon: ShieldAlert, text: "Total permanent disability" },
  { icon: HeartPulse, text: "Critical illness (defined conditions)" },
  { icon: Clock, text: "Temporary disablement (30-day wait)" },
];

export default function CoverageTierCard({
  isSelected,
  onSelect,
  weeklyPrice,
  monthlyPrice,
  annualPrice,
}: CoverageTierCardProps) {
  return (
    <div
      className={`relative rounded-2xl border-2 bg-white p-7 transition-all duration-200 cursor-pointer shadow-[0_10px_30px_rgba(15,23,42,0.08)] ${
        isSelected
          ? "border-magenta shadow-[0_16px_40px_rgba(15,23,42,0.15)] ring-4 ring-magenta/10"
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
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-magenta/10">
          <Shield className="h-5 w-5 text-magenta" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-grey-500">
            Core product
          </p>
          <h3 className="text-xl font-bold text-navy">
            Parent Continuity Cover
          </h3>
        </div>
      </div>

      <ul className="space-y-3 text-small text-grey-700">
        {parentContinuityFeatures.map(({ icon: FeatureIcon, text }) => (
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
          {formatCurrency(Math.round(monthlyPrice))}/month ·{" "}
          {formatCurrency(Math.round(annualPrice))}/year
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-grey-500">
        <span>{isSelected ? "Selected" : "Tap to select"}</span>
        <span className="rounded-full border border-grey-200 px-2 py-0.5 text-[11px]">
          Core cover
        </span>
      </div>
    </div>
  );
}
