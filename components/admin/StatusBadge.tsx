const statusStyles: Record<string, string> = {
  converted: "bg-[var(--admin-success)] text-white",
  pending: "bg-[var(--admin-info)] text-white",
  abandoned: "bg-[var(--admin-warning)] text-[#1a2332]",
  expired: "bg-[#4a5568] text-white",
  active: "bg-[var(--admin-success)] text-white",
  pending_payment: "bg-[var(--admin-warning)] text-[#1a2332]",
  lapsed: "bg-[#4a5568] text-white",
  cancelled: "bg-[var(--admin-error)] text-white",
  renewed: "bg-[var(--admin-success)] text-white",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        statusStyles[status] ?? "bg-[#4a5568] text-white",
      ].join(" ")}
    >
      {status.replace("_", " ")}
    </span>
  );
}
