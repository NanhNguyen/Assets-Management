"use client";

import { formatCurrency, type Asset } from "@/lib/mockData";
import { fetchAssets, generateSummaryStats } from "@/lib/api";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export default function ReportsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [depreciationYears, setDepreciationYears] = useState<number>(5);
  const [calcMode, setCalcMode] = useState<"auto" | "manual">("auto");
  const [manualMonthly, setManualMonthly] = useState<number>(50000000);

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const stats = useMemo(() => generateSummaryStats(assets), [assets]);
  const departments = stats.departments;

  const categoryData = useMemo(() => {
    const cats = new Map();
    assets.forEach(a => {
      if (!cats.has(a.category)) cats.set(a.category, { name: a.category, count: 0, value: 0, pct: 0 });
      const c = cats.get(a.category);
      c.count++;
      c.value += a.price;
    });
    const arr = Array.from(cats.values());
    arr.forEach(c => c.pct = stats.totalAssets > 0 ? Math.round((c.count / stats.totalAssets) * 100) : 0);
    return arr.sort((a, b) => b.count - a.count);
  }, [assets, stats.totalAssets]);

  const depreciationCalc = useMemo(() => {
    if (calcMode === "auto") {
      const totalValue = stats.totalValue;
      const monthlyRate = totalValue / (depreciationYears * 12);
      const yearlyRate = totalValue / depreciationYears;
      return { monthlyRate, yearlyRate };
    } else {
      return { monthlyRate: manualMonthly, yearlyRate: manualMonthly * 12 };
    }
  }, [stats.totalValue, depreciationYears, calcMode, manualMonthly]);

  if (isLoading) return <div className="flex h-64 items-center justify-center text-primary font-bold">Đang tải biểu đồ...</div>;

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
          { label: "Tổng tài sản", value: stats.totalAssets.toLocaleString("vi-VN"), icon: "inventory_2", trend: "+12%", color: "primary" },
          { label: "Tổng giá trị", value: `${(stats.totalValue / 1000000000).toFixed(1)} tỷ đ`, icon: "payments", trend: "+8%", color: "emerald-500" },
          { label: "Tỷ lệ sử dụng", value: "76.2%", icon: "pie_chart", trend: "+3%", color: "orange-500" },
          { 
            label: "Khấu hao / tháng", 
            value: formatCurrency(depreciationCalc.monthlyRate).replace("₫", "đ"), 
            icon: "trending_down", 
            trend: calcMode === "manual" ? "Nhập tay" : "-2.4%",
            color: "red-500" 
          },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-5 card-hover relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl bg-surface-container flex items-center justify-center text-${kpi.color}`}>
                  <span className="material-symbols-outlined text-xl">{kpi.icon}</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${kpi.trend.startsWith("+") ? "bg-status-success/10 text-status-success" : "bg-status-error/10 text-status-error"}`}>
                  {kpi.trend}
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-on-surface tracking-tighter">{kpi.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-outline mt-1">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6 lg:space-y-8">
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
                { label: "Đang sử dụng", value: stats.inUse, pct: 76, color: "bg-status-success" },
                { label: "Chưa sử dụng", value: stats.unused, pct: 10, color: "bg-status-info" },
                { label: "Đang bảo trì", value: stats.maintenance, pct: 7, color: "bg-status-warning" },
                { label: "Đã thanh lý", value: stats.liquidated, pct: 7, color: "bg-status-error" },
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
        </div>

        {/* Right Panel: Insights and AI */}
        <div className="xl:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-soft border border-surface-container/30"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h4 className="text-lg font-black tracking-tighter">Insights</h4>
            </div>

            <div className="space-y-6">
              {departments.slice(0, 5).map((dept, i) => (
                <div key={dept.code} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">{dept.name}</span>
                    <span className="text-[10px] font-black text-outline bg-surface-container-low px-1.5 py-0.5 rounded-md">{dept.assetCount}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.2 + i * 0.1 }}
                      className={`h-full rounded-full transition-all ${i % 2 === 0 ? "bg-primary" : "bg-orange-500"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* New Depreciation Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-soft border border-surface-container/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">calculate</span>
              </div>
              <h4 className="text-lg font-black tracking-tighter">Ước tính Khấu hao</h4>
            </div>

            <div className="space-y-6">
              <div className="flex bg-surface-container-low p-1 rounded-xl border border-surface-container">
                <button
                  onClick={() => setCalcMode("auto")}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calcMode === "auto" ? "bg-white shadow-sm text-primary" : "text-outline"}`}
                >
                  Tự động
                </button>
                <button
                  onClick={() => setCalcMode("manual")}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calcMode === "manual" ? "bg-white shadow-sm text-primary" : "text-outline"}`}
                >
                  Nhập tay
                </button>
              </div>

              {calcMode === "auto" ? (
                <div>
                  <label className="text-[10px] font-black uppercase text-outline tracking-widest block mb-2">Thời gian khấu hao (Năm)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={depreciationYears}
                      onChange={(e) => setDepreciationYears(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-sm font-black focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-xs font-bold text-on-surface-variant">năm</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black uppercase text-outline tracking-widest block mb-2">Giá trị khấu hao tháng (VNĐ)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={manualMonthly}
                      onChange={(e) => setManualMonthly(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-sm font-black focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Dự kiến mất giá / tháng</p>
                  <p className="text-xl font-black text-on-surface">{formatCurrency(depreciationCalc.monthlyRate)}</p>
                </div>
                <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                  <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-1">Dự kiến mất giá / năm</p>
                  <p className="text-xl font-black text-on-surface">{formatCurrency(depreciationCalc.yearlyRate)}</p>
                </div>
              </div>

              <p className="text-[9px] text-outline leading-tight italic">
                * Công thức: Tổng giá trị hiện tại chia cho tổng số tháng khấu hao dự kiến. Kết quả mang tính chất tham khảo cho kế hoạch tài chính.
              </p>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-primary-fixed-dim p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <h4 className="text-lg font-black tracking-tight mb-2">Thông minh AI</h4>
              <p className="text-xs font-semibold text-white/70 leading-relaxed mb-6">
                Bạn có 45 tài sản sắp hết thời gian khấu hao. Hãy chuẩn bị phương án thanh lý.
              </p>
              <button className="w-full py-3 bg-white text-primary rounded-xl text-xs font-bold shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                Xem danh sách
              </button>
            </div>
          </motion.div>

          {/* Export Options inside Right Panel or as a card below */}
          <div className="card p-6">
            <h4 className="text-base font-bold text-on-surface mb-4">Xuất báo cáo tài chính</h4>
            <div className="space-y-3">
              {[
                { label: "Báo cáo tổng hợp", icon: "table_chart" },
                { label: "Báo cáo kế toán", icon: "receipt_long" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  className="w-full p-4 bg-surface-container-low rounded-2xl text-left hover:bg-surface-container transition-colors group flex items-center gap-4"
                >
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <p className="text-sm font-bold text-on-surface">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
