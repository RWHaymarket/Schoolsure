type DonutDatum = {
  label: string;
  value: number;
  color?: string;
};

export default function DonutChart({
  data,
  size = 160,
  strokeWidth = 20,
}: {
  data: DonutDatum[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let cumulative = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((item) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const arc = (item.value / total) * circumference;
        const offset = circumference - arc - cumulative;
        cumulative += arc;

        return (
          <circle
            key={item.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={item.color ?? "var(--admin-accent)"}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc} ${circumference - arc}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
      })}
    </svg>
  );
}
