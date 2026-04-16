"use client";

import { assets, formatCurrency } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonnelPage() {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPersonnel = personnel.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Personnel Tracking</span>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mt-3">
          Quản lý Nhân sự & Bàn giao
        </h2>
        <p className="text-sm font-semibold text-outline mt-3 max-w-2xl">
          Theo dõi danh sách tài sản theo từng nhân sự. Hỗ trợ quy trình kiểm kê và bàn giao khi nhân viên nghỉ việc hoặc chuyển bộ phận.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative max-w-2xl"
      >
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl">
          person_search
        </span>
        <input
          className="input-field !pl-14 !rounded-2xl !py-4 shadow-sm focus:shadow-xl focus:shadow-primary/5 border border-surface-container/50 transition-all"
          placeholder="Nhập tên nhân sự cần tra cứu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Personnel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPersonnel.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-surface-container/30 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center text-primary text-2xl font-black shadow-inner border border-primary/5">
                  {person.name.split(" ").pop()?.charAt(0)}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                    {person.assets.length} Tài sản
                  </span>
                  <p className="text-[10px] text-outline font-bold mt-1 uppercase tracking-widest">{person.department}</p>
                </div>
              </div>

              <h3 className="text-lg font-black text-on-surface mb-1 group-hover:text-primary transition-colors">{person.name}</h3>
              <p className="text-xs font-bold text-outline mb-6">{person.position}</p>

              <div className="space-y-3 mb-6 bg-surface-container-low/50 p-4 rounded-2xl border border-surface-container">
                <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-2">Danh sách mượn:</p>
                {person.assets.slice(0, 3).map((asset: any) => (
                  <div key={asset.id} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">{asset.icon}</span>
                    <span className="text-xs font-semibold text-on-surface-variant truncate">{asset.name}</span>
                  </div>
                ))}
                {person.assets.length > 3 && (
                  <p className="text-[10px] font-bold text-primary italic">... và {person.assets.length - 3} tài sản khác</p>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">assignment_return</span>
                  Xem bàn giao
                </button>
                <button className="p-3 bg-surface-container-low text-outline rounded-xl hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-lg">print</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
