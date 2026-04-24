"use client";

import { Asset, formatCurrency, formatDate } from "@/lib/mockData";
import { fetchAssets, generateSummaryStats } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { useState, useEffect, useMemo } from "react";

export default function ReportsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const stats = useMemo(() => generateSummaryStats(assets), [assets]);
  const departments = stats.departments;

  const handleExportExcel = (type: "general" | "accounting" = "general") => {
    let excelData;
    let fileName;

    if (type === "general") {
      fileName = `Bao_cao_tong_hop_${new Date().toISOString().split('T')[0]}`;
      excelData = assets.map((asset, index) => ({
        "STT": index + 1,
        "NHÓM TÀI SẢN": asset.group_name,
        "LOẠI TÀI SẢN": asset.category,
        "TÊN TÀI SẢN": asset.name,
        "MÃ TS": asset.code,
        "THÔNG SỐ KỸ THUẬT": asset.notes,
        "SL": 1,
        "NGƯỜI SỬ DỤNG": asset.user,
        "PHÒNG BAN": asset.department,
        "TRẠNG THÁI": asset.status === "active" ? "Đang dùng" : "Lưu kho",
        "GHI CHÚ": asset.notes
      }));
    } else {
      fileName = `Bao_cao_ke_toan_${new Date().toISOString().split('T')[0]}`;
      excelData = assets.map((asset, index) => {
        const originalPrice = asset.price;
        const depMonths = parseInt(asset.depreciation_months) || 1;
        const pDate = new Date(asset.purchaseDate);
        const now = new Date();
        const monthsOwned = (now.getFullYear() - pDate.getFullYear()) * 12 + (now.getMonth() - pDate.getMonth());
        const depreciationPerMonth = originalPrice / depMonths;
        const currentDepreciation = Math.min(originalPrice, Math.max(0, monthsOwned) * depreciationPerMonth);
        const remainingValue = originalPrice - currentDepreciation;

        return {
          "STT": index + 1,
          "MÃ TÀI SẢN": asset.code,
          "TÊN TÀI SẢN": asset.name,
          "NGÀY MUA": formatDate(asset.purchaseDate),
          "NGUYÊN GIÁ (VNĐ)": originalPrice,
          "THỜI GIAN KHẤU HAO (THÁNG)": `${depMonths} tháng`,
          "KHẤU HAO LŨY KẾ": Math.round(currentDepreciation),
          "GIÁ TRỊ CÒN LẠI": Math.round(remainingValue),
          "ĐƠV VỊ BÁN": asset.vendor,
          "TRẠNG THÁI": asset.status
        };
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const wscols = Object.keys(excelData[0]).map(() => ({ wch: 20 }));
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const depreciationCalc = useMemo(() => {
    let totalMonthly = 0;
    assets.forEach(asset => {
      const duration = parseInt(asset.depreciation_months);
      if (duration > 0 && asset.price > 0) {
        totalMonthly += asset.price / duration;
      }
    });
    return { 
      monthlyRate: totalMonthly, 
      yearlyRate: totalMonthly * 12 
    };
  }, [assets]);

  if (isLoading) return <div className="flex h-screen items-center justify-center text-primary font-bold">Đang tải báo cáo...</div>;

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <p className="label-text">Analytics Executive</p>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-on-surface mt-1">
            Báo cáo & Phân tích
          </h2>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="btn-primary flex items-center gap-2 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:translate-y-0.5 transition-transform">download</span>
          Xuất Báo cáo Excel
        </button>
      </div>

      {/* 1. TOP ROW: PRIMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Tổng tài sản", value: stats.totalAssets.toLocaleString("vi-VN"), icon: "inventory_2", trend: "+12%", color: "primary" },
          { label: "Tổng giá trị", value: formatCurrency(stats.totalValue), icon: "payments", trend: "+8%", color: "emerald-500" },
          { label: "Tỷ lệ sử dụng", value: "76.2%", icon: "pie_chart", trend: "+3%", color: "orange-500" },
          {
            label: "Khấu hao dự kiến",
            value: formatCurrency(depreciationCalc.monthlyRate),
            icon: "trending_down",
            trend: "Tự động",
            color: "red-500"
          },
        ].map((kpi, idx) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6 card-hover relative overflow-hidden group border-none bg-white shadow-xl shadow-black/[0.03]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/5 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${kpi.color === 'primary' ? 'bg-primary/10 text-primary' : `bg-${kpi.color}/10 text-${kpi.color}`}`}>
                  <span className="material-symbols-outlined text-2xl">{kpi.icon}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${kpi.trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                    {kpi.trend}
                  </span>
                  <p className="text-[8px] font-bold text-outline mt-1 uppercase">Tháng này</p>
                </div>
              </div>
              <h3 className="text-2xl font-black text-on-surface tracking-tighter leading-none mb-1">{kpi.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-outline">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Core Data Visualization (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Status Breakdown Section */}
          <section className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-soft border border-surface-container/30">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h4 className="text-xl font-black tracking-tighter">Trạng thái vận hành</h4>
                <p className="text-xs text-outline font-medium mt-1">Phân bổ chi tiết số lượng tài sản theo tình trạng sử dụng</p>
              </div>
              <div className="h-10 w-10 flex items-center justify-center text-outline">
                <span className="material-symbols-outlined">donut_large</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Đang sử dụng", count: 13, pct: 76, color: "bg-emerald-500", icon: "task_alt" },
                { label: "Chưa sử dụng", count: 0, pct: 10, color: "bg-primary", icon: "inventory" },
                { label: "Đang bảo trì", count: 0, pct: 7, color: "bg-orange-500", icon: "build" },
                { label: "Đã thanh lý", count: 0, pct: 7, color: "bg-red-500", icon: "delete_sweep" },
              ].map((item) => (
                <div key={item.label} className="p-6 rounded-[2rem] bg-surface-container-low border border-surface-container hover:border-primary/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-lg ${item.color.replace('bg-', 'text-')}`}>{item.icon}</span>
                      <span className="text-sm font-bold text-on-surface">{item.label}</span>
                    </div>
                    <span className="text-xl font-black">{item.count}</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-outline font-black uppercase tracking-widest">{item.pct}% tỉ lệ cơ cấu</span>
                    <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Xem danh sách</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Department Insights Section */}
          <section className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-soft border border-surface-container/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
               <span className="material-symbols-outlined text-surface-container text-8xl opacity-20">hub</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <h4 className="text-xl font-black tracking-tighter">Hiệu suất phòng ban</h4>
                  <p className="text-xs text-outline font-medium mt-0.5">Thống kê số lượng tài sản được cấp phát tại các đơn vị</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {departments.slice(0, 6).map((dept: { name: string; assetCount: number; code: string; percentage: number }, i: number) => (
                  <div key={dept.code} className="group">
                    <div className="flex items-center justify-between mb-3 leading-none">
                      <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-all group-hover:translate-x-1 duration-300 italic">{dept.name}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-on-surface">{dept.assetCount}</span>
                        <span className="text-[10px] text-outline font-bold uppercase">Tài sản</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dept.percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: AI Analysis & Financial Planning (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* AI Strategy Advisor */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-primary-fixed-dim bg-gradient-to-br from-primary-fixed-dim to-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group"
          >
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" 
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-300 text-xl">auto_awesome</span>
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Advisor Insight</h4>
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter leading-tight">Gợi ý lộ trình đầu tư tài sản</h3>
              <p className="text-[13px] font-medium text-white/80 leading-relaxed mb-10">
                AI phân tích thấy <span className="text-emerald-300 font-bold">45 tài sản</span> sẽ kết thúc vòng đời khấu hao trong 3 tháng tới. Hãy xem xét phương án thuê ngoài hoặc nâng cấp để tối ưu chi phí vận hành.
              </p>
              <button className="w-full py-4 bg-white text-primary rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-surface-container-low active:scale-[0.98] transition-all">
                Mở phân tích chi tiết
              </button>
            </div>
          </motion.div>

          {/* Interactive Financial Calculator - Removed as per request for full automation */}
          <section className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-soft border border-surface-container/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">insights</span>
              </div>
              <div>
                <h4 className="text-lg font-black tracking-tighter">Tổng quan Khấu hao</h4>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Financial Summary</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs text-outline leading-relaxed italic">
                Hệ thống tự động tính toán số tiền khấu hao dựa trên Nguyên giá và Thời hạn khấu hao của từng tài sản riêng biệt.
              </p>
              
              <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase text-primary/70 tracking-widest mb-1">Dự toán khấu hao định kỳ</p>
                  <p className="text-3xl font-black text-on-surface tracking-tighter">{formatCurrency(depreciationCalc.monthlyRate)}</p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-[9px] text-outline font-black uppercase tracking-widest italic">Giá trị tổng hợp theo thời gian thực</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* RE-USEABLE EXPORT MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">sim_card_download</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter leading-none">Lựa chọn định dạng</h3>
                      <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-2 px-1 border-l-2 border-primary">Excel Export Protocol</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowExportModal(false)}
                    className="h-12 w-12 rounded-full hover:bg-surface-container flex items-center justify-center transition-all bg-surface-container-low"
                  >
                    <span className="material-symbols-outlined text-outline">close</span>
                  </button>
                </div>

                <div className="space-y-5 mb-10">
                  <button
                    onClick={() => { handleExportExcel("general"); setShowExportModal(false); }}
                    className="w-full p-8 bg-surface-container-low rounded-[2.5rem] text-left hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-6">
                      <div className="h-14 w-14 shrink-0 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-3xl">grid_view</span>
                      </div>
                      <div>
                        <p className="text-lg font-black text-on-surface mb-1">Báo cáo Tổng hợp</p>
                        <p className="text-[13px] text-on-surface-variant leading-relaxed opacity-70">
                          Toàn diện thông tin về mã, kỹ thuật và đối tượng sử dụng. Ưu tiên cho quản lý vận hành kho bãi.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleExportExcel("accounting"); setShowExportModal(false); }}
                    className="w-full p-8 bg-surface-container-low rounded-[2.5rem] text-left hover:bg-emerald-500/5 border-2 border-transparent hover:border-emerald-500/20 transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-6">
                      <div className="h-14 w-14 shrink-0 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-3xl">currency_exchange</span>
                      </div>
                      <div>
                        <p className="text-lg font-black text-on-surface mb-1">Báo cáo Kế toán</p>
                        <p className="text-[13px] text-on-surface-variant leading-relaxed opacity-70">
                          Tối ưu hóa các trường tài chính: Nguyên giá, tỷ lệ hao mòn và giá trị còn lại hiện thời.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full py-4 text-[10px] font-black text-outline hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                >
                  Hủy bỏ & Quay lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
