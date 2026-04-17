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

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isWarrantyUpdateOpen, setIsWarrantyUpdateOpen] = useState(false);
  const [newWarrantyDate, setNewWarrantyDate] = useState("");
  const currentUser = "Nguyễn Anh";

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  // Compute dynamic stats
  const stats = useMemo(() => {
    const totalValue = assets.reduce((sum, a) => sum + a.price, 0);
    return {
      totalAssets: assets.length,
      totalValue
    };
  }, [assets]);

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
  }, [assets]);

  const logEvent = (action: string, asset: any, extra = {}) => {
    const newLog = {
      id: Date.now().toString(),
      action,
      assetName: asset.name,
      assetCode: asset.code,
      description: action === "delete" ? `Xóa tài sản: ${asset.name}` : action === "create" ? `Thêm mới tài sản: ${asset.name}` : `Cập nhật tài sản: ${asset.name}`,
      timestamp: new Date().toISOString(),
      user: currentUser,
      ...extra
    };
    const savedLogs = localStorage.getItem("plutus_audit_logs");
    const logs = savedLogs ? JSON.parse(savedLogs) : [];
    localStorage.setItem("plutus_audit_logs", JSON.stringify([newLog, ...logs]));
  };

  const handleDeleteAsset = (id: string) => {
    if (!deleteReason.trim()) {
      alert("Vui lòng nhập lý do xóa tài sản!");
      return;
    }
    const assetToDelete = assets.find(a => a.id === id);
    if (assetToDelete) {
      logEvent("delete", assetToDelete, { reason: deleteReason });
      const savedDeleted = localStorage.getItem("plutus_deleted_assets");
      const deleted = savedDeleted ? JSON.parse(savedDeleted) : [];
      localStorage.setItem("plutus_deleted_assets", JSON.stringify([
        { ...assetToDelete, deleteReason, deletedDate: new Date().toISOString() },
        ...deleted
      ]));
    }
    setAssets(prev => prev.filter(a => a.id !== id));
    setIsDeleteModalOpen(false);
    setIsModalOpen(false);
    setDeleteReason("");
    alert(`Đã xóa tài sản. Người thực hiện: ${currentUser}. Lý do: ${deleteReason}`);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: newStatus as any } : a));
    setIsStatusUpdateOpen(false);
    alert(`Đã cập nhật trạng thái. Người thực hiện: ${currentUser}`);
  };

  const handleUpdateWarranty = (id: string) => {
    if (!newWarrantyDate) return;
    setAssets(prev => prev.map(a => a.id === id ? { ...a, warrantyEnd: newWarrantyDate } : a));
    setIsWarrantyUpdateOpen(false);
    alert(`Đã cập nhật thông tin bảo hành. Người thực hiện: ${currentUser}`);
  };

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
          { label: "Tổng số tài sản", val: stats.totalAssets.toLocaleString("vi-VN"), extra: "+12%", icon: "inventory", color: "indigo" },
          { label: "Tổng giá trị", val: `${(stats.totalValue / 1000000000).toFixed(1)} tỷ đ`, extra: "VNĐ", icon: "payments", color: "sky" },
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
                          onClick={() => {
                            setSelectedAsset(asset);
                            setIsModalOpen(true);
                          }}
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
                        {person.assets.slice(0, 5).map((asset: any) => (
                          <div 
                            key={asset.id} 
                            className="flex items-center gap-2 hover:bg-primary/5 p-1 rounded-lg cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAsset(asset);
                              setIsModalOpen(true);
                            }}
                          >
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

      {/* Asset Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl bg-${selectedAsset?.iconColor}/10 flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-${selectedAsset?.iconColor} text-3xl`}>{selectedAsset?.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-on-surface">{selectedAsset?.name}</h3>
                      <p className="text-xs font-bold text-outline uppercase tracking-widest">{selectedAsset?.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 w-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline transition-all"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Status & Delete Controls */}
                  <div className="flex items-center justify-between pb-6 border-b border-surface-container">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest">Trạng thái hiện tại</p>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={selectedAsset?.status} />
                        <button 
                          onClick={() => setIsStatusUpdateOpen(!isStatusUpdateOpen)}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          Thay đổi
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Xóa tài sản
                    </button>
                  </div>

                  {isStatusUpdateOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-surface-container-low rounded-2xl border border-primary/20"
                    >
                      <p className="text-[10px] font-black mb-3">Chọn trạng thái mới:</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(selectedAsset?.id, "active")}
                          className="flex-1 py-2 rounded-lg bg-green-600 text-white text-[10px] font-bold"
                        >
                          Đang sử dụng
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedAsset?.id, "unused")}
                          className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-[10px] font-bold"
                        >
                          Không sử dụng
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        Ngày được bàn giao
                      </p>
                      <p className="text-sm font-bold text-on-surface">{formatDate(selectedAsset?.purchaseDate)}</p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50 relative group/warranty">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">verified_user</span>
                        Hạn bảo hành
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-on-surface">{formatDate(selectedAsset?.warrantyEnd)}</p>
                        <button 
                          onClick={() => setIsWarrantyUpdateOpen(!isWarrantyUpdateOpen)}
                          className="material-symbols-outlined text-sm text-primary opacity-0 group-hover/warranty:opacity-100 transition-opacity"
                        >
                          edit
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-outline mt-1 uppercase">Kiểm tra định kỳ 6 tháng/lần</p>
                    </div>
                  </div>

                  {isWarrantyUpdateOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-surface-container-low rounded-2xl border border-primary/20"
                    >
                      <p className="text-[10px] font-black mb-2">Ngày hết hạn bảo hành mới:</p>
                      <div className="flex gap-2">
                        <input 
                          type="date"
                          className="flex-1 bg-white border border-surface-container rounded-lg px-3 py-2 text-xs"
                          onChange={(e) => setNewWarrantyDate(e.target.value)}
                        />
                        <button 
                          onClick={() => handleUpdateWarranty(selectedAsset?.id)}
                          className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg"
                        >
                          Lưu
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">qr_code</span>
                      Mã sản phẩm / Serial
                    </p>
                    <p className="text-sm font-mono font-black text-primary">{selectedAsset?.code}</p>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">terminal</span>
                      Cấu hình & Chi tiết
                    </p>
                    <p className="text-sm font-medium text-on-surface leading-relaxed italic">
                      {selectedAsset?.notes || "Không có thông tin cấu hình chi tiết."}
                    </p>
                  </div>

                  <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        Người đang sử dụng
                      </p>
                      <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Editor: {currentUser}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {selectedAsset?.user?.split(" ").pop()?.substring(0, 2).toUpperCase() || "NA"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{selectedAsset?.user || "N/A"}</p>
                        <p className="text-[10px] font-bold text-outline">{selectedAsset?.department} • {selectedAsset?.position}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-8 py-4 bg-surface-container-high text-on-surface font-black rounded-2xl transition-all"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl"
            >
              <h3 className="text-xl font-black text-on-surface mb-2">Xác nhận xóa tài sản</h3>
              <p className="text-sm text-outline mb-6">Bạn đang thực hiện xóa <b>{selectedAsset?.name}</b>. Hành động này sẽ được ghi nhật ký hệ thống bởi <b>{currentUser}</b>.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Lý do xóa tài sản (Bắt buộc)</label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-surface-container rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="VD: Tài sản đã hư hỏng không thể sửa chữa, hoặc đã thanh lý..."
                    rows={4}
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-4 font-bold text-outline hover:text-on-surface transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={() => handleDeleteAsset(selectedAsset?.id)}
                    className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
