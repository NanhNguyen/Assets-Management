import { statusLabels, type Asset } from "@/lib/mockData";

export default function StatusBadge({ status }: { status: Asset["status"] | string }) {
  const label = statusLabels[status as string] || status;
  
  const getStyles = () => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "maintenance":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "liquidated":
        return "bg-red-50 text-red-600 border-red-100";
      case "unused":
        return "bg-slate-50 text-slate-600 border-slate-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case "active": return "bg-emerald-500";
      case "maintenance": return "bg-amber-500";
      case "liquidated": return "bg-red-500";
      case "unused": return "bg-slate-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 w-fit ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`} />
      {label}
    </span>
  );
}
