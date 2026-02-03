import { formatCurrency } from "@/lib/utils";

interface QuoteSummaryProps {
  schoolName: string;
  yearLevel: string;
  yearsRemaining: number;
  includeStudentCover: boolean;
  includeExpensesCover: boolean;
  pricing: {
    weekly: number;
    monthly: number;
    annual: number;
    annualWithDiscount: number;
    totalProtection: number;
    savings: number;
  };
  quoteReference: string;
}

export default function QuoteSummary({
  schoolName,
  yearLevel,
  yearsRemaining,
  includeStudentCover,
  includeExpensesCover,
  pricing,
  quoteReference,
}: QuoteSummaryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-grey-100 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
      <div className="border-b border-grey-100 bg-grey-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-grey-500">YOUR QUOTE</p>
            <h3 className="text-lg font-bold text-navy">{schoolName || "Your school"}</h3>
            <p className="text-sm text-grey-600">
              {yearLevel || "Year level"} · Until Year 12 ({yearsRemaining} years)
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-grey-500">Ref</p>
            <p className="text-sm font-mono text-grey-700">{quoteReference}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-magenta font-medium">★</span>
            <span className="ml-1 font-semibold text-navy">
              Parent Continuity Cover
            </span>
          </div>
          <span className="font-semibold text-navy">
            {formatCurrency(pricing.weekly)}/week
          </span>
        </div>

        {includeStudentCover ? (
          <div className="flex items-center justify-between text-grey-600">
            <span>Student Continuity Cover</span>
            <span>+1% of annual fee</span>
          </div>
        ) : null}

        {includeExpensesCover ? (
          <div className="flex items-center justify-between text-grey-600">
            <span>Annual School Expenses Cover</span>
            <span>+$50/year</span>
          </div>
        ) : null}

        <div className="border-t border-grey-200 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-navy">Total</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-navy">
                {formatCurrency(pricing.weekly)}/week
              </span>
              <p className="text-sm text-grey-500">
                {formatCurrency(pricing.monthly)}/month · {formatCurrency(pricing.annual)}/year
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-green-50 px-6 py-3">
        <div>
          <p className="font-medium text-green-800">Pay annually and save 10%</p>
          <p className="text-sm text-green-700">
            Annual price: {formatCurrency(pricing.annualWithDiscount)}
          </p>
        </div>
        <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
          Save {formatCurrency(pricing.savings)}
        </span>
      </div>

      <div className="border-t border-grey-100 px-6 py-4">
        <p className="text-sm text-grey-500">Total protection value</p>
        <p className="text-xl font-bold text-navy">
          {formatCurrency(pricing.totalProtection)} AUD
        </p>
      </div>
    </div>
  );
}
