import { Check, GraduationCap, PiggyBank } from "lucide-react";

interface AddOnCardProps {
  id: "student" | "deposits";
  title: string;
  description: string;
  weeklyPrice: number;
  isSelected: boolean;
  onToggle: () => void;
}

const iconMap = {
  student: GraduationCap,
  deposits: PiggyBank,
};

export default function AddOnCard({
  id,
  title,
  description,
  weeklyPrice,
  isSelected,
  onToggle,
}: AddOnCardProps) {
  const Icon = iconMap[id];

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onToggle();
      }}
      className={`rounded-xl p-5 transition-all duration-200 cursor-pointer border-2 shadow-[0_8px_20px_rgba(15,23,42,0.06)] ${
        isSelected
          ? "border-magenta bg-magenta/5 shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
          : "border-grey-200 bg-white hover:border-grey-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              isSelected ? "border-magenta bg-magenta" : "border-grey-300"
            }`}
          >
            {isSelected ? <Check className="h-3 w-3 text-white" /> : null}
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-grey-100">
              <Icon className="h-4 w-4 text-navy" />
            </div>
            <div>
              <h4 className="font-semibold text-navy">{title}</h4>
              <p className="mt-1 text-sm text-grey-600">{description}</p>
              <button className="mt-2 text-sm font-semibold text-magenta" type="button">
                Learn more
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-magenta whitespace-nowrap">
            +${weeklyPrice}/week
          </span>
          <div className="mt-1 text-xs text-grey-500">
            {isSelected ? "Added" : "Optional"}
          </div>
        </div>
      </div>
    </div>
  );
}
