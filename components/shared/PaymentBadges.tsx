type PaymentBadgesProps = {
  className?: string;
};

const badges = ["Visa", "Mastercard", "AMEX", "Apple Pay"];

export default function PaymentBadges({ className = "" }: PaymentBadgesProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {badges.map((label) => (
        <span
          key={label}
          className="rounded-lg border border-grey-200 bg-white px-3 py-1 text-xs font-semibold text-navy shadow-sm"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
