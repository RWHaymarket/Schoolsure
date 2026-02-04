type BarChartDatum = {
  label: string;
  value: number;
};

type LineSeries = {
  values: number[];
  color: string;
  dashed?: boolean;
  strokeWidth?: number;
  opacity?: number;
};

export default function BarChart({
  data,
  height = 240,
  lines = [],
}: {
  data: BarChartDatum[];
  height?: number;
  lines?: LineSeries[];
}) {
  const max = Math.max(
    ...data.map((item) => item.value),
    ...lines.flatMap((line) => line.values),
    1
  );
  const step = 100 / Math.max(data.length, 1);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative flex items-end gap-3 overflow-hidden" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / max) * 100;
          return (
            <div
              key={`${item.label}-${index}`}
              className="relative z-10 flex flex-1 flex-col items-center gap-2"
            >
              <div className="relative h-full w-full rounded-md bg-[var(--admin-border)]">
                <div
                  className="admin-bar absolute bottom-0 w-full rounded-md bg-[var(--admin-accent)]"
                  style={{
                    height: `${barHeight}%`,
                    opacity: 0.85,
                    animationDelay: `${index * 50}ms`,
                  }}
                />
              </div>
              <div className="text-xs text-[var(--admin-text-muted)]">{item.label}</div>
            </div>
          );
        })}
        {lines.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {lines.map((line, lineIndex) => {
              const points = line.values
                .map((value, index) => {
                  const x = step * index + step / 2;
                  const y = 100 - (value / max) * 100;
                  return `${x},${y}`;
                })
                .join(" ");
              return (
                <polyline
                  key={`line-${lineIndex}`}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={line.strokeWidth ?? 1.5}
                  strokeDasharray={line.dashed ? "4 4" : "none"}
                  opacity={line.opacity ?? 0.6}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={points}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
