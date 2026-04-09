import { summaryStats, departments, formatCurrency } from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="label-text">Tổng quan hệ thống</p>
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mt-1">
          Dashboard
        </h2>
      </div>

      {/* Bento Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Total Assets */}
        <div className="lg:col-span-4 card p-6 lg:p-8 flex flex-col justify-between min-h-[180px] lg:min-h-[220px] relative overflow-hidden group card-hover">
          <div className="relative z-10">
            <span className="label-text">Tổng số tài sản</span>
            <div className="mt-3 lg:mt-4">
              <h3 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter">
                {summaryStats.totalAssets.toLocaleString("vi-VN")}
              </h3>
              <p className="text-sm font-medium text-primary mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +12% so với tháng trước
              </p>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[10rem]">inventory_2</span>
          </div>
        </div>

        {/* Total Value */}
        <div className="lg:col-span-5 bg-primary p-6 lg:p-8 rounded-3xl shadow-glow-lg flex flex-col justify-between min-h-[180px] lg:min-h-[220px] text-white relative overflow-hidden card-hover">
          <div className="relative z-10">
            <span className="text-xs font-bold text-primary-fixed-dim uppercase tracking-wider">Tổng giá trị</span>
            <div className="mt-3 lg:mt-4">
              <h3 className="text-3xl lg:text-5xl font-black tracking-tighter">42.5 tỷ VNĐ</h3>
              <p className="text-sm font-medium text-white/80 mt-2">Dự kiến khấu hao đến 2026</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent" />
        </div>

        {/* Departments */}
        <div className="lg:col-span-3 bg-surface-container-low p-6 lg:p-8 rounded-3xl flex flex-col justify-center min-h-[180px] lg:min-h-[220px] card-hover">
          <div className="flex -space-x-3 mb-4">
            {["IT", "HR", "RD", "+8"].map((code, i) => (
              <div
                key={code}
                className={`h-10 w-10 lg:h-12 lg:w-12 rounded-2xl flex items-center justify-center ring-4 ring-surface-container-low text-xs font-bold ${
                  i === 0 ? "bg-primary/20 text-primary" :
                  i === 1 ? "bg-tertiary/20 text-tertiary" :
                  i === 2 ? "bg-secondary/20 text-secondary" :
                  "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {code}
              </div>
            ))}
          </div>
          <h4 className="text-lg font-bold text-on-surface">{summaryStats.departments} Phòng Ban</h4>
          <p className="text-sm text-outline font-medium">Đang vận hành tài sản</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Đang sử dụng", value: summaryStats.inUse, color: "text-status-success", bg: "bg-green-50", icon: "check_circle" },
          { label: "Chưa sử dụng", value: summaryStats.unused, color: "text-status-info", bg: "bg-blue-50", icon: "pause_circle" },
          { label: "Đang bảo trì", value: summaryStats.maintenance, color: "text-status-warning", bg: "bg-amber-50", icon: "build" },
          { label: "Đã thanh lý", value: summaryStats.liquidated, color: "text-status-error", bg: "bg-red-50", icon: "delete_sweep" },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} p-5 lg:p-6 rounded-2xl card-hover`}>
            <span className={`material-symbols-outlined ${item.color} text-2xl`}>{item.icon}</span>
            <h4 className="text-2xl lg:text-3xl font-black text-on-surface mt-2">{item.value}</h4>
            <p className="text-xs font-semibold text-on-surface-variant mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Dept Distribution */}
        <div className="lg:col-span-8 bg-surface-container-low p-6 lg:p-8 rounded-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-2">
            <div>
              <h4 className="text-lg lg:text-xl font-bold text-on-surface">Phân bổ theo phòng ban</h4>
              <p className="text-sm text-outline font-medium">Tỷ lệ giá trị tài sản phân bổ toàn hệ thống</p>
            </div>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              Xem chi tiết
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="flex items-end gap-3 lg:gap-6 h-36 lg:h-48 px-2 lg:px-4">
            {departments.slice(0, 5).map((dept) => (
              <div key={dept.code} className="flex-1 flex flex-col items-center gap-2 lg:gap-3">
                <div
                  className="w-full bg-primary rounded-t-xl transition-all hover:bg-primary-dark"
                  style={{ height: `${dept.percentage}%`, opacity: 0.3 + (dept.percentage / 100) * 0.7 }}
                />
                <span className="text-[9px] lg:text-[10px] font-bold text-outline uppercase text-center">{dept.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warranty Alerts */}
        <div className="lg:col-span-4 card p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-lg lg:text-xl font-bold text-on-surface mb-2">Cảnh báo</h4>
            <p className="text-sm text-outline font-medium">Tình trạng cần xử lý</p>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-status-error">emergency</span>
                <span className="text-sm font-bold text-on-surface">Chưa gán người ({summaryStats.unassigned})</span>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-status-warning">warning</span>
                <span className="text-sm font-bold text-on-surface">Thiếu thông tin ({summaryStats.missingInfo})</span>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-status-warning">schedule</span>
                <span className="text-sm font-bold text-on-surface">Sắp hết bảo hành (45)</span>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
