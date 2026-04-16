"use client";

import { assets, departments, summaryStats, formatCurrency, formatDate, statusLabels, statusColors } from "@/lib/mockData";
import { motion, AnimatePresence, Variants } from "framer-motion";
import StatusBadge from "@/components/StatusBadge";

export default function Dashboard() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 lg:space-y-8 pb-10"
    >
      {/* Top Banner - Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-indigo-700 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-glow-lg group"
        >
          {/* Decorative Elements */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/30 transition-all duration-700" 
          />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-black text-white uppercase tracking-widest px-4 py-1.5 bg-black/20 rounded-full inline-block mb-6 backdrop-blur-md border border-white/10"
            >
              Tổng giá trị tài sản
            </motion.span>
            <div className="mt-2 lg:mt-4">
              <motion.h3
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-4xl lg:text-7xl font-extrabold tracking-tighter"
              >
                4.5 tỷ <span className="text-2xl lg:text-3xl font-bold opacity-80">VNĐ</span>
              </motion.h3 >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.8 }}
                className="text-sm lg:text-lg font-medium text-white/90 mt-4 max-w-lg leading-relaxed"
              >
                Hệ thống Plutus đang tối ưu hóa vận hành 216 tài sản tại 7 phòng ban chiến lược.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 lg:mt-12 flex flex-wrap gap-4"
            >
              <button className="bg-white text-primary px-8 py-4 rounded-2xl text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
                Xem chi tiết
              </button>
              <button className="bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl text-sm font-bold hover:bg-white/20 transition-all">
                Xuất báo cáo
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6">
          {[
            { label: "Tổng số tài sản", val: summaryStats.totalAssets, icon: "inventory_2", color: "text-primary", bg: "bg-primary/10" },
            { label: "Đang sử dụng", val: summaryStats.inUse, icon: "check_circle", color: "text-tertiary", bg: "bg-tertiary/10" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-surface-container-low p-6 lg:p-10 rounded-[2.5rem] flex flex-col justify-between card-hover border border-surface-container-high/40 shadow-sm shadow-black/[0.02]"
            >
              <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <span className={`material-symbols-rounded ${stat.color} text-3xl`}>{stat.icon}</span>
              </div>
              <div className="mt-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-outline">{stat.label}</span>
                <h4 className="text-4xl font-black tracking-tighter mt-1">{stat.val}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Department Distribution Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-7 bg-white p-6 lg:p-10 rounded-[3rem] shadow-soft border border-surface-container/30">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black tracking-tight">Cơ cấu phòng ban</h3>
              <p className="text-sm font-semibold text-outline mt-1">Phân bổ tài sản theo đơn vị công tác</p>
            </div>
            <button className="h-12 w-12 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
              <span className="material-symbols-rounded text-outline text-2xl">insights</span>
            </button>
          </div>

          <div className="space-y-8">
            {departments.map((dept, i) => (
              <div key={dept.code} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-on-surface flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-md ${i % 2 === 0 ? "bg-primary" : "bg-tertiary"} shadow-sm`} />
                    {dept.name}
                  </span>
                  <span className="text-[11px] font-black text-outline bg-surface-container-low px-2 py-1 rounded-lg">{dept.assetCount} tài sản</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.8 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${i % 2 === 0 ? "bg-primary shadow-[0_0_15px_-5px_#6366F1]" : "bg-tertiary shadow-[0_0_15px_-5px_#F59E0B]"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Assets List */}
        <motion.div variants={itemVariants} className="lg:col-span-5 bg-surface-container-low p-6 lg:p-8 rounded-[3rem] flex flex-col h-full border border-surface-container-high/40 shadow-sm">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xl font-black">Mới cập nhật</h3>
            <motion.span 
              whileHover={{ x: 3 }}
              className="text-sm font-bold text-primary cursor-pointer flex items-center gap-1"
            >
              Xem tất cả <span className="material-symbols-rounded text-sm">east</span>
            </motion.span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar lg:max-h-[400px]">
            <AnimatePresence mode="popLayout">
              {assets.slice(0, 5).map((asset, idx) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,1)" }}
                  className="bg-white/60 p-5 rounded-3xl flex items-center gap-5 shadow-sm border border-black/[0.02] group transition-all"
                >
                  <div className={`h-14 w-14 rounded-2xl bg-${asset.iconColor}/10 flex items-center justify-center group-hover:bg-${asset.iconColor}/20 transition-colors`}>
                    <span className={`material-symbols-rounded text-${asset.iconColor} text-2xl`}>{asset.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold truncate group-hover:text-primary transition-colors">{asset.name}</h4>
                    <p className="text-[11px] font-semibold text-outline mt-1">{asset.department} • {formatDate(asset.purchaseDate)}</p>
                  </div>
                  <StatusBadge status={asset.status} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="mt-10 p-6 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-[2rem] text-white shadow-xl shadow-indigo-500/20"
          >
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <span className="material-symbols-rounded text-white text-2xl">notifications_active</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Kế hoạch sắp tới</p>
                <p className="text-xs font-bold leading-relaxed mt-1">
                  Bắt đầu kiểm kê tài sản cố định quý II vào ngày **01/05/2026**.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
