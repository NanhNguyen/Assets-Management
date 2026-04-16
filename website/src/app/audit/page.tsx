"use client";

import { formatDate, type AuditLog } from "@/lib/mockData";
import { fetchAuditLogs } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const actionConfig: Record<string, { icon: string; bg: string; color: string; label: string }> = {
  create: { icon: "add_circle", bg: "bg-green-100", color: "text-green-600", label: "Tạo mới" },
  edit: { icon: "edit", bg: "bg-primary/10", color: "text-primary", label: "Chỉnh sửa" },
  export: { icon: "download", bg: "bg-secondary/10", color: "text-secondary", label: "Xuất dữ liệu" },
  delete: { icon: "delete", bg: "bg-red-100", color: "text-red-600", label: "Xóa" },
};

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<"history" | "deleted">("history");
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [deletedAssets, setDeletedAssets] = useState<any[]>([]);

  useEffect(() => {
    // Fetch logs from DB
    fetchAuditLogs().then(data => {
      // We can still combine local stored logs if any, or just use DB logs
      const savedLogs = localStorage.getItem("plutus_audit_logs");
      if (savedLogs) {
        setLogs([...JSON.parse(savedLogs), ...data]);
      } else {
        setLogs(data);
      }
    }).catch(console.error);

    const savedDeleted = localStorage.getItem("plutus_deleted_assets");
    if (savedDeleted) {
      setDeletedAssets(JSON.parse(savedDeleted));
    }
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">System Ledger</span>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mt-4">
            Nhật ký hoạt động
          </h2>
          <p className="text-sm font-semibold text-outline mt-3 max-w-2xl">
            Mọi thay đổi trên hệ thống Plutus được ghi nhận theo thời gian thực và không thể thay đổi.
          </p>
        </div>
        
        <div className="flex bg-surface-container-low rounded-2xl p-1.5 border border-surface-container-high/50 shadow-inner">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all relative ${activeTab === "history" ? "text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
          >
            {activeTab === "history" && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl -z-10" />
            )}
            Lịch sử hoạt động
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all relative flex items-center gap-2 ${activeTab === "deleted" ? "text-red-600 shadow-sm" : "text-outline hover:text-red-500"}`}
          >
            {activeTab === "deleted" && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl -z-10" />
            )}
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Đã xóa gần đây
          </button>
        </div>
      </motion.div>

      {/* Content Switcher */}
      <AnimatePresence mode="wait">
        {activeTab === "history" ? (
          <motion.div 
            key="history"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Filters */}
            <div className="flex flex-wrap gap-2.5">
              {["Tất cả", "Tạo mới", "Chỉnh sửa", "Xóa", "Xuất dữ liệu"].map((f, i) => (
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
            </div>

            <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-soft border border-surface-container/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-outline/10 text-8xl font-black">history</span>
              </div>
              
              <div className="space-y-1 relative z-10">
                {logs.map((log, index) => {
                  const config = actionConfig[log.action] || actionConfig.edit;
                  const time = new Date(log.timestamp);
                  const timeStr = time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                  const dateStr = formatDate(log.timestamp);

                  return (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
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
                        {index < logs.length - 1 && (
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

                        {log.reason && (
                          <div className="mt-3 p-4 bg-red-50/50 rounded-2xl border border-red-100 flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 text-sm mt-0.5 font-bold whitespace-nowrap">info</span>
                            <p className="text-xs font-medium text-red-700 leading-relaxed italic">Lý do: {log.reason}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-outline uppercase">
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
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="deleted"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="bg-red-50/50 p-6 rounded-[2rem] border border-red-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                    <span className="material-symbols-outlined text-3xl">delete_forever</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-red-700">Tài sản đã xóa gần đây</h4>
                    <p className="text-xs font-bold text-red-600/70 uppercase tracking-widest">Danh sách chờ thanh lý vĩnh viễn</p>
                  </div>
               </div>
               <p className="text-[10px] font-black font-mono text-red-500/50 uppercase tracking-tighter">Automatic cleanup in 30 days</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deletedAssets.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-surface-container-high">
                  <span className="material-symbols-outlined text-outline/20 text-6xl mb-4">inventory_2</span>
                  <p className="text-sm font-bold text-outline">Không có tài sản nào đã xóa gần đây</p>
                </div>
              ) : (
                deletedAssets.map((asset, i) => (
                  <motion.div 
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-[2rem] border border-surface-container/50 shadow-sm relative group overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`h-11 w-11 rounded-xl bg-${asset.iconColor}/10 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-${asset.iconColor}`}>{asset.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-on-surface">{asset.name}</p>
                        <p className="text-[10px] font-bold text-outline font-mono uppercase tracking-tighter">{asset.code}</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-surface-container/30 text-xs font-bold">
                       <div className="flex justify-between text-outline">
                          <span>Người sử dụng cũ:</span>
                          <span className="text-on-surface">{asset.user}</span>
                       </div>
                       <div className="flex justify-between text-outline">
                          <span>Ngày xóa:</span>
                          <span className="text-on-surface">{formatDate(asset.deletedDate || Date.now())}</span>
                       </div>
                       <div className="p-3 bg-red-50 rounded-xl text-red-700 italic font-medium leading-relaxed">
                          Lý do: {asset.deleteReason || "Không có lý do chi tiết."}
                       </div>
                    </div>
                    
                    <button className="w-full mt-4 py-3 rounded-xl bg-surface-container text-outline hover:text-primary hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                       Khôi phục tài sản
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
