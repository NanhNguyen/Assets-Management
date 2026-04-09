import { auditLogs, formatDate } from "@/lib/mockData";

const actionConfig: Record<string, { icon: string; bg: string; color: string; label: string }> = {
  create: { icon: "add_circle", bg: "bg-green-100", color: "text-status-success", label: "Tạo mới" },
  edit: { icon: "edit", bg: "bg-primary/10", color: "text-primary", label: "Chỉnh sửa" },
  export: { icon: "download", bg: "bg-secondary/10", color: "text-secondary", label: "Xuất dữ liệu" },
  delete: { icon: "delete", bg: "bg-red-100", color: "text-status-error", label: "Xóa" },
};

export default function AuditPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <p className="label-text">Theo dõi hệ thống</p>
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mt-1">
          Lịch sử hoạt động
        </h2>
        <p className="text-sm text-on-surface-variant mt-2">
          Mọi thay đổi trong hệ thống đều được ghi nhận. Không thể xóa hoặc chỉnh sửa log.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["Tất cả", "Tạo mới", "Chỉnh sửa", "Xuất dữ liệu"].map((f, i) => (
          <button key={f} className={`filter-chip ${i === 0 ? "filter-chip-active" : "filter-chip-inactive"}`}>{f}</button>
        ))}
      </div>

      {/* Timeline */}
      <div className="card p-4 lg:p-6">
        <div className="space-y-1">
          {auditLogs.map((log, index) => {
            const config = actionConfig[log.action];
            const time = new Date(log.timestamp);
            const timeStr = time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
            const dateStr = formatDate(log.timestamp);

            return (
              <div key={log.id} className="flex gap-4 group relative">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                    <span className={`material-symbols-outlined ${config.color} text-lg`}>{config.icon}</span>
                  </div>
                  {index < auditLogs.length - 1 && (
                    <div className="w-0.5 flex-1 bg-surface-container my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{log.description}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        <span className="font-semibold">{log.assetName}</span>
                        <span className="text-outline"> • {log.assetCode}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-on-surface">{timeStr}</p>
                      <p className="text-[10px] text-outline">{dateStr}</p>
                    </div>
                  </div>

                  {log.field && (
                    <div className="mt-2 p-3 bg-surface-container-low rounded-xl text-sm">
                      <span className="text-on-surface-variant">{log.field}: </span>
                      <span className="text-status-error line-through">{log.oldValue}</span>
                      <span className="text-outline mx-2">→</span>
                      <span className="text-status-success font-bold">{log.newValue}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${config.bg} ${config.color}`}>{config.label}</span>
                    <span className="text-xs text-outline">bởi {log.user}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-2xl">
        <span className="material-symbols-outlined text-primary text-lg">lock</span>
        <p className="text-xs font-medium text-on-surface-variant">
          Audit log là bất biến (immutable). Không thể xóa hoặc chỉnh sửa bất kỳ bản ghi nào.
        </p>
      </div>
    </div>
  );
}
