import { statusLabels, statusColors, type Asset } from "@/lib/mockData";

export default function StatusBadge({ status }: { status: Asset["status"] }) {
  const colors = statusColors[status];
  const label = statusLabels[status];

  return (
    <span className={`status-badge ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}
