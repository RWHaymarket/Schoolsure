type SparklineProps = {
  data: number[];
  height?: number;
  color?: string;
};

export default function Sparkline({
  data,
  height = 40,
  color = "var(--admin-accent)",
}: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <polyline
        className="admin-sparkline"
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={color}
        opacity="0.1"
      />
    </svg>
  );
}
