"use client";

import { auditLogs, formatDate } from "@/lib/mockData";
import { motion } from "framer-motion";

const actionConfig: Record<string, { icon: string; bg: string; color: string; label: string }> = {
  create: { icon: "add_circle", bg: "bg-green-100", color: "text-green-600", label: "Tạo mới" },
  edit: { icon: "edit", bg: "bg-primary/10", color: "text-primary", label: "Chỉnh sửa" },
  export: { icon: "download", bg: "bg-secondary/10", color: "text-secondary", label: "Xuất dữ liệu" },
  delete: { icon: "delete", bg: "bg-red-100", color: "text-red-600", label: "Xóa" },
};

export default function AuditPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">System Ledger</span>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mt-4">
          Nhật ký hoạt động
        </h2>
        <p className="text-sm font-semibold text-outline mt-3 max-w-2xl">
          Mọi thay đổi trên hệ thống Plutus được ghi nhận theo thời gian thực và không thể thay đổi.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2.5"
      >
        {["Tất cả", "Tạo mới", "Chỉnh sửa", "Bàn giao", "Thanh lý"].map((f, i) => (
          <button 
            key={f} 
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              i === 0 
                ? "bg-primary text-white border-primary shadow-primary/20" 
                : "bg-white text-outline border-surface-container-high hover:bg-surface-container-low"
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-soft border border-surface-container/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8">
           <span className="material-symbols-outlined text-outline/10 text-8xl font-black">history</span>
        </div>
        
        <div className="space-y-1 relative z-10">
          {auditLogs.map((log, index) => {
            const config = actionConfig[log.action] || actionConfig.edit;
            const time = new Date(log.timestamp);
            const timeStr = time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
            const dateStr = formatDate(log.timestamp);

            return (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex gap-6 group relative"
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className={`h-12 w-12 rounded-2xl ${config.bg} flex items-center justify-center flex-shrink-0 z-10 shadow-sm border-2 border-white transition-all`}
                  >
                    <span className={`material-symbols-outlined ${config.color} text-2xl`}>{config.icon}</span>
                  </motion.div>
                  {index < auditLogs.length - 1 && (
                    <div className="w-0.5 flex-1 bg-surface-container/50 my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">{log.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-outline uppercase">{log.assetName}</span>
                        <span className="text-[10px] font-black text-outline/50 font-mono">[{log.assetCode}]</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0 bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container">
                      <p className="text-xs font-black text-primary tracking-tighter">{timeStr}</p>
                      <p className="text-[10px] font-bold text-outline">{dateStr}</p>
                    </div>
                  </div>

                  {log.field && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 p-4 bg-surface-container-low/50 rounded-2xl text-sm border border-surface-container/30"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-outline mb-1 uppercase tracking-widest">{log.field} changed</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-red-500 line-through opacity-70 font-medium">{log.oldValue}</span>
                        <span className="material-symbols-outlined text-outline text-sm">trending_flat</span>
                        <span className="text-green-600 font-black">{log.newValue}</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-3 mt-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-outline">
                         {log.user[0]}
                      </div>
                      <span className="text-xs font-bold text-outline">by {log.user}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-sm"
      >
        <div className="h-10 w-10 flex-shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center">
           <span className="material-symbols-outlined text-primary text-2xl">security</span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Security Protocol</p>
          <p className="text-xs font-bold text-on-surface-variant leading-relaxed mt-0.5">
            Audit log là tài liệu pháp lý số, đảm bảo tính bất biến của mọi lịch sử thay đổi tài sản.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
