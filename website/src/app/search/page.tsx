"use client";

import { departments, formatCurrency, formatDate, summaryStats, type Asset } from "@/lib/mockData";
import { fetchAssets } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"assets" | "personnel">("assets");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  // Derive unique personnel from assets
  const personnel = useMemo(() => {
    const userMap = new Map();
    assets.forEach(asset => {
      if (!userMap.has(asset.user)) {
        userMap.set(asset.user, {
          name: asset.user,
          department: asset.department,
          position: asset.position,
          assets: []
        });
      }
      userMap.get(asset.user).assets.push(asset);
    });
    return Array.from(userMap.values());
  }, []);

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || a.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredPersonnel = personnel.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        <div className="flex bg-surface-container-low rounded-2xl p-1.5 border border-surface-container-high/50 shadow-inner">
          <button
            onClick={() => setActiveTab("assets")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all relative ${activeTab === "assets" ? "text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
          >
            {activeTab === "assets" && (
              <motion.div layoutId="search-tab-bg" className="absolute inset-0 bg-white rounded-xl -z-10" />
            )}
            Tài sản
          </button>
          <button
            onClick={() => setActiveTab("personnel")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all relative flex items-center gap-2 ${activeTab === "personnel" ? "text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
          >
            {activeTab === "personnel" && (
              <motion.div layoutId="search-tab-bg" className="absolute inset-0 bg-white rounded-xl -z-10" />
            )}
            Nhân sự
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Tổng số tài sản", val: summaryStats.totalAssets.toLocaleString("vi-VN"), extra: "+12%", icon: "inventory", color: "indigo" },
          { label: "Tổng giá trị", val: "4.5 tỷ đ", extra: "VNĐ", icon: "payments", color: "sky" },
          { label: "Người sử dụng", val: personnel.length, extra: "nhân sự", icon: "group", color: "violet" }
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
                  {activeTab === "assets" ? "search" : "person_search"}
                </span>
                <input
                  className="input-field !pl-14 !rounded-2xl !py-4 shadow-sm focus:shadow-xl focus:shadow-primary/5 border border-surface-container/50 transition-all"
                  placeholder={activeTab === "assets" ? "Tìm theo tên tài sản, mã serial, người sử dụng..." : "Tìm nhân viên theo tên hoặc phòng ban..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {activeTab === "assets" && (
                <div className="flex flex-wrap items-center gap-3">
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
              )}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "assets" ? (
                <motion.div
                  key="assets-table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="table-header border-b border-surface-container/50 bg-surface-container-lowest">
                        <th className="px-8 py-5">Thông tin tài sản</th>
                        <th className="px-8 py-5">Mã Serial</th>
                        <th className="px-8 py-5">Người sử dụng</th>
                        <th className="px-8 py-5">Trạng thái</th>
                        <th className="px-8 py-5 text-right">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container/30">
                      {filteredAssets.map((asset, idx) => (
                        <motion.tr 
                          key={asset.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          className="group hover:bg-surface-container-low/40 transition-all cursor-pointer"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`h-12 w-12 rounded-2xl bg-${asset.iconColor}/10 flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-${asset.iconColor} text-2xl`}>{asset.icon}</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-on-surface">{asset.name}</p>
                                <p className="text-[11px] text-outline font-semibold uppercase tracking-wider">{asset.manufacturer}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-mono text-xs font-bold text-outline">{asset.code}</td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface">{asset.user}</span>
                              <span className="text-[10px] text-outline font-bold uppercase">{asset.department}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6"><StatusBadge status={asset.status} /></td>
                          <td className="px-8 py-6 text-right font-black text-sm">{formatCurrency(asset.price)}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div
                  key="personnel-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredPersonnel.map((person, i) => (
                    <div key={person.name} className="bg-surface-container-lowest p-6 rounded-[2.5rem] border border-surface-container group hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-6">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center text-primary text-2xl font-black">
                          {person.name.split(" ").pop()?.charAt(0)}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">
                            {person.assets.length} Tài sản
                          </span>
                          <p className="text-[10px] text-outline font-bold mt-1 uppercase">{person.department}</p>
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-on-surface mb-1">{person.name}</h3>
                      <p className="text-xs font-bold text-outline mb-6">{person.position}</p>
                      
                      <div className="space-y-2 mb-6 bg-white p-4 rounded-2xl border border-surface-container-low shadow-inner">
                        <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-2 font-mono">Assets Assigned</p>
                        {person.assets.slice(0, 2).map((asset: any) => (
                          <div key={asset.id} className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm text-primary">{asset.icon}</span>
                             <span className="text-xs font-bold text-on-surface-variant truncate">{asset.name}</span>
                          </div>
                        ))}
                        {person.assets.length > 2 && (
                          <p className="text-[10px] font-bold text-primary">... và {person.assets.length - 2} tài sản khác</p>
                        )}
                      </div>
                      
                      <button className="w-full py-3 bg-surface-container text-outline rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                        Chi tiết bàn giao
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {filteredAssets.length === 0 && filteredPersonnel.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-outline">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20 text-red-500">search_off</span>
                <p className="font-black text-sm uppercase tracking-widest opacity-40 text-red-500">Không tìm thấy kết quả nào</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
