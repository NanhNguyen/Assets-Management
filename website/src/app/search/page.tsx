"use client";

import { assets, departments, formatCurrency, formatDate, summaryStats } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || a.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Explore Center</span>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mt-3">
            Trung tâm Tra cứu
          </h2>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center gap-2 border border-surface-container shadow-sm px-6 py-3"
        >
          <span className="material-symbols-outlined text-xl">download</span>
          Export Excel
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Tổng số tài sản", val: summaryStats.totalAssets.toLocaleString("vi-VN"), extra: "+12%", icon: "inventory", color: "indigo" },
          { label: "Tổng giá trị", val: "4.5 tỷ đ", extra: "VNĐ", icon: "payments", color: "sky" },
          { label: "Người sử dụng", val: summaryStats.activeUsers, extra: "đang hoạt động", icon: "group", color: "violet" }
        ].map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 lg:p-8 rounded-[2rem] shadow-soft border border-surface-container/50 card-hover"
          >
            <div className={`h-12 w-12 rounded-2xl bg-${s.color}-500/10 flex items-center justify-center mb-6`}>
              <span className={`material-symbols-outlined text-${s.color}-500 text-2xl`}>{s.icon}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">{s.label}</span>
            <h3 className="text-3xl font-black text-on-surface mt-1">{s.val}</h3>
            {s.label === "Tổng số tài sản" ? (
              <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>{s.extra}
              </p>
            ) : (
              <p className="text-xs font-semibold text-outline mt-2">{s.extra}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Left: Filters + Table */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-soft border border-surface-container/30 overflow-hidden"
          >
            {/* Search + Filters */}
            <div className="p-6 lg:p-10 border-b border-surface-container/50 bg-surface-container-lowest/50">
              <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">
                  search
                </span>
                <input
                  className="input-field !pl-14 !rounded-2xl !py-4 shadow-sm focus:shadow-xl focus:shadow-primary/5 border border-surface-container/50 transition-all"
                  placeholder="Tìm theo tên tài sản, mã serial, người sử dụng hoặc phòng ban…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold border border-surface-container-high"
                >
                  <span className="material-symbols-outlined text-lg">tune</span>
                  Bộ lọc nâng cao
                </motion.button>
                <div className="h-6 w-px bg-surface-container mx-2 hidden sm:block" />
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "active", label: "Đang sử dụng" },
                  { key: "maintenance", label: "Bảo trì" },
                  { key: "unused", label: "Chưa sử dụng" },
                  { key: "liquidated", label: "Thanh lý" },
                ].map((f) => (
                  <motion.button
                    key={f.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      activeFilter === f.key 
                        ? "bg-primary text-white shadow-primary/20 scale-105" 
                        : "bg-surface-container-low text-outline hover:bg-surface-container border border-surface-container-high"
                    }`}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="table-header border-b border-surface-container/50 bg-surface-container-lowest">
                    <th className="px-8 py-5">Thông tin tài sản</th>
                    <th className="px-8 py-5">Mã Serial</th>
                    <th className="px-8 py-5">Đơn vị</th>
                    <th className="px-8 py-5">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Giá trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/30">
                  <AnimatePresence mode="popLayout">
                    {filteredAssets.map((asset, idx) => (
                      <motion.tr 
                        key={asset.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-surface-container-low/40 transition-all cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`h-12 w-12 rounded-2xl bg-${asset.iconColor}/10 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all`}
                            >
                              <span className={`material-symbols-outlined text-${asset.iconColor} text-2xl`}>{asset.icon}</span>
                            </motion.div>
                            <div>
                              <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{asset.name}</p>
                              <p className="text-[11px] text-outline font-semibold uppercase tracking-wider mt-0.5">{asset.manufacturer}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-black font-mono text-outline bg-surface-container-low px-2 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                            {asset.code}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                             {asset.department}
                          </span>
                        </td>
                        <td className="px-8 py-6"><StatusBadge status={asset.status} /></td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <p className="text-sm font-black text-on-surface">{formatCurrency(asset.price)}</p>
                            <p className="text-[10px] font-bold text-outline mt-0.5 whitespace-nowrap">{formatDate(asset.purchaseDate)}</p>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredAssets.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 flex flex-col items-center justify-center text-outline"
                >
                  <span className="material-symbols-outlined text-6xl mb-4 opacity-20">search_off</span>
                  <p className="font-bold">Không tìm thấy tài sản nào phù hợp</p>
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            <div className="p-8 border-t border-surface-container/50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface-container-lowest/30">
              <p className="text-[10px] font-black text-outline uppercase tracking-widest">
                Showing <span className="text-primary">{filteredAssets.length}</span> of {summaryStats.totalAssets} results
              </p>
              <div className="flex items-center gap-2">
                <button className="h-10 w-10 flex items-center justify-center bg-surface-container-low rounded-xl text-outline border border-surface-container-high hover:text-primary transition-all shadow-sm">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20">1</button>
                <button className="h-10 w-10 flex items-center justify-center bg-surface-container-low rounded-xl text-sm font-bold text-outline hover:bg-surface-container transition-all">2</button>
                <button className="h-10 w-10 flex items-center justify-center bg-surface-container-low rounded-xl text-sm font-bold text-outline hover:bg-surface-container transition-all">3</button>
                <button className="h-10 w-10 flex items-center justify-center bg-surface-container-low rounded-xl text-outline border border-surface-container-high hover:text-primary transition-all shadow-sm">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
