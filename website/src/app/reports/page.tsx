import { departments, summaryStats, formatCurrency } from "@/lib/mockData";

export default function ReportsPage() {
  const categoryData = [
    { name: "Máy tính", count: 342, value: 15200000000, pct: 36 },
    { name: "Server & Hạ tầng", count: 87, value: 12100000000, pct: 28 },
    { name: "Nội thất", count: 234, value: 5600000000, pct: 13 },
    { name: "Thiết bị IoT", count: 198, value: 4200000000, pct: 10 },
    { name: "Máy in", count: 89, value: 3400000000, pct: 8 },
    { name: "Khác", count: 334, value: 2000000000, pct: 5 },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <p className="label-text">Phân tích dữ liệu</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mt-1">
            Báo cáo & Phân tích
          </h2>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Excel
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng tài sản", value: summaryStats.totalAssets.toLocaleString("vi-VN"), icon: "inventory_2", trend: "+12%" },
          { label: "Tổng giá trị", value: "42.5 tỷ đ", icon: "payments", trend: "+8%" },
          { label: "Tỷ lệ sử dụng", value: "76.2%", icon: "pie_chart", trend: "+3%" },
          { label: "TB khấu hao", value: "24.5%", icon: "trending_down", trend: "-2%" },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary">{kpi.icon}</span>
              <span className="text-xs font-bold text-status-success">{kpi.trend}</span>
            </div>
            <h3 className="text-2xl font-black text-on-surface">{kpi.value}</h3>
            <p className="text-xs text-on-surface-variant mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="card p-5 lg:p-6">
          <h4 className="text-base font-bold text-on-surface mb-5">Phân bổ theo loại tài sản</h4>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-on-surface">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-outline">{cat.count} TS</span>
                    <span className="text-sm font-bold text-primary">{cat.pct}%</span>
                  </div>
                </div>
                <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Department */}
        <div className="card p-5 lg:p-6">
          <h4 className="text-base font-bold text-on-surface mb-5">Giá trị theo phòng ban</h4>
          <div className="flex items-end gap-3 lg:gap-4 h-48 mb-4">
            {departments.slice(0, 6).map((dept) => (
              <div key={dept.code} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-on-surface">
                  {(dept.totalValue / 1000000000).toFixed(1)}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-primary to-tertiary rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${dept.percentage}%` }}
                />
                <span className="text-[9px] font-bold text-outline uppercase">{dept.code}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-outline text-center">Đơn vị: Tỷ VNĐ</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="card p-5 lg:p-6">
        <h4 className="text-base font-bold text-on-surface mb-5">Tổng hợp trạng thái tài sản</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Đang sử dụng", value: summaryStats.inUse, pct: 76, color: "bg-status-success" },
            { label: "Chưa sử dụng", value: summaryStats.unused, pct: 10, color: "bg-status-info" },
            { label: "Đang bảo trì", value: summaryStats.maintenance, pct: 7, color: "bg-status-warning" },
            { label: "Đã thanh lý", value: summaryStats.liquidated, pct: 7, color: "bg-status-error" },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-surface-container-low rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-on-surface-variant">{s.label}</span>
                <span className="text-lg font-black text-on-surface">{s.value}</span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
              </div>
              <p className="text-[10px] text-outline mt-1.5">{s.pct}% tổng số</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="card p-5 lg:p-6">
        <h4 className="text-base font-bold text-on-surface mb-4">Xuất báo cáo</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Toàn bộ tài sản", desc: "Xuất đầy đủ dữ liệu", icon: "table_chart" },
            { label: "Theo bộ lọc", desc: "Xuất dữ liệu đã lọc", icon: "filter_alt" },
            { label: "Báo cáo kế toán", desc: "Chuẩn format kế toán", icon: "receipt_long" },
          ].map((opt) => (
            <button
              key={opt.label}
              className="p-4 bg-surface-container-low rounded-2xl text-left hover:bg-surface-container transition-colors group"
            >
              <span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform inline-block">{opt.icon}</span>
              <p className="text-sm font-bold text-on-surface">{opt.label}</p>
              <p className="text-xs text-outline mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
