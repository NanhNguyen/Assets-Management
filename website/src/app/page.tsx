"use client";

import { assets, formatCurrency, formatDate, statusLabels } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [editableAssets, setEditableAssets] = useState([...assets]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // New states for specialized edits
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isWarrantyUpdateOpen, setIsWarrantyUpdateOpen] = useState(false);
  const [newWarrantyDate, setNewWarrantyDate] = useState("");
  
  const currentUser = "Nguyễn Anh"; // Placeholder for current logged in user

  const categories = ["Tất cả", "Máy tính", "Máy in", "Nội thất", "Màn hình", "Dây cáp HDMI", "Bình hoa"];

  const filteredAssets = selectedCategory === "Tất cả" 
    ? editableAssets 
    : editableAssets.filter(a => a.category === selectedCategory || a.group === selectedCategory);

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
    const assetToDelete = editableAssets.find(a => a.id === id);
    if (assetToDelete) {
      // Log to audit
      logEvent("delete", assetToDelete, { reason: deleteReason });
      
      // Save to recently deleted
      const savedDeleted = localStorage.getItem("plutus_deleted_assets");
      const deleted = savedDeleted ? JSON.parse(savedDeleted) : [];
      localStorage.setItem("plutus_deleted_assets", JSON.stringify([
        { ...assetToDelete, deleteReason, deletedDate: new Date().toISOString() },
        ...deleted
      ]));
    }

    setEditableAssets(prev => prev.filter(a => a.id !== id));
    setIsDeleteModalOpen(false);
    setIsModalOpen(false);
    setDeleteReason("");
    alert(`Đã xóa tài sản. Người thực hiện: ${currentUser}. Lý do: ${deleteReason}`);
  };

  const handleUpdateStatus = (id: string, newStatus: "active" | "unused") => {
    setEditableAssets(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setIsStatusUpdateOpen(false);
    alert(`Đã cập nhật trạng thái. Người thực hiện: ${currentUser}`);
  };

  const handleUpdateWarranty = (id: string) => {
    if (!newWarrantyDate) return;
    setEditableAssets(prev => prev.map(a => a.id === id ? { ...a, warrantyEnd: newWarrantyDate } : a));
    setIsWarrantyUpdateOpen(false);
    alert(`Đã cập nhật thông tin bảo hành. Người thực hiện: ${currentUser}`);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Assets Catalog</span>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mt-3">
            Kho Tài Sản
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-container-low rounded-2xl p-1.5 border border-surface-container-high/50 shadow-inner">
            {(["list", "grid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2.5 rounded-xl transition-all relative flex items-center gap-2 ${viewMode === mode ? "text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
              >
                {viewMode === mode && (
                  <motion.div layoutId="view-bg" className="absolute inset-0 bg-white rounded-xl -z-10" />
                )}
                <span className="material-symbols-outlined text-xl">
                  {mode === "list" ? "view_list" : "grid_view"}
                </span>
              </button>
            ))}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const demoAsset = { name: "Demo Asset " + Date.now(), code: "DEMO-" + Math.floor(Math.random() * 1000) };
              logEvent("create", demoAsset);
              alert("Đã ghi nhận sự kiện 'Thêm mới' vào Nhật ký hoạt động!");
            }}
            className="btn-primary flex items-center gap-2 px-6 py-3.5 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-xl">add_box</span>
            Thêm mới
          </motion.button>
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2.5"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              selectedCategory === cat 
                ? "bg-primary text-white border-primary shadow-primary/20" 
                : "bg-white text-outline border-surface-container-high hover:bg-surface-container-low"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredAssets.map((asset, i) => (
              <motion.div 
                key={asset.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedAsset(asset);
                  setIsModalOpen(true);
                }}
                className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-surface-container/30 group cursor-pointer relative overflow-hidden hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`h-14 w-14 rounded-2xl bg-${asset.iconColor}/10 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-${asset.iconColor} text-2xl`}>{asset.icon}</span>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </div>
                </div>
                <h4 className="text-base font-black text-on-surface mb-1 line-clamp-1">{asset.name}</h4>
                <p className="text-[11px] text-outline font-black font-mono tracking-tighter mb-4 uppercase">{asset.code}</p>
                <div className="flex items-center justify-between pt-4 border-t border-surface-container/50">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{asset.department}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold">
                      {asset.user.split(" ").pop()?.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold text-on-surface">{asset.user}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : viewMode === "list" ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-[2.5rem] shadow-soft border border-surface-container/30 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="table-header border-b border-surface-container/50 bg-surface-container-lowest">
                    <th className="px-8 py-5">Tên Tài Sản</th>
                    <th className="px-8 py-5 text-center">Phân loại</th>
                    <th className="px-8 py-5">Đơn vị</th>
                    <th className="px-8 py-5">Người đang sử dụng</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/30">
                  {filteredAssets.map((asset, i) => (
                    <tr 
                      key={asset.id} 
                      className="group hover:bg-surface-container-low/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-11 w-11 rounded-xl bg-${asset.iconColor}/10 flex items-center justify-center`}>
                            <span className={`material-symbols-outlined text-${asset.iconColor}`}>{asset.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{asset.name}</p>
                            <p className="text-[10px] font-black font-mono text-outline mt-0.5">{asset.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-outline border border-surface-container px-2 py-0.5 rounded-md">
                          {asset.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-on-surface-variant">{asset.department}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                            {asset.user.split(" ").pop()?.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-on-surface">{asset.user}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="p-2.5 bg-surface-container-low rounded-xl text-outline group-hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl bg-${selectedAsset.iconColor}/10 flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-${selectedAsset.iconColor} text-3xl`}>{selectedAsset.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-on-surface">{selectedAsset.name}</h3>
                      <p className="text-xs font-bold text-outline uppercase tracking-widest">{selectedAsset.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 w-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline transition-all"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status & Delete Controls */}
                  <div className="flex items-center justify-between pb-6 border-b border-surface-container">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest">Trạng thái hiện tại</p>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={selectedAsset.status} />
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
                          onClick={() => handleUpdateStatus(selectedAsset.id, "active")}
                          className="flex-1 py-2 rounded-lg bg-green-600 text-white text-[10px] font-bold"
                        >
                          Đang sử dụng
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedAsset.id, "unused")}
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
                      <p className="text-sm font-bold text-on-surface">{formatDate(selectedAsset.purchaseDate)}</p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50 relative group/warranty">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">verified_user</span>
                        Hạn bảo hành
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-on-surface">{formatDate(selectedAsset.warrantyEnd)}</p>
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
                          onClick={() => handleUpdateWarranty(selectedAsset.id)}
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
                    <p className="text-sm font-mono font-black text-primary">{selectedAsset.code}</p>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">terminal</span>
                      Cấu hình & Chi tiết
                    </p>
                    <p className="text-sm font-medium text-on-surface leading-relaxed italic">
                      {selectedAsset.notes || "Không có thông tin cấu hình chi tiết."}
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
                        {selectedAsset.user.split(" ").pop()?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{selectedAsset.user}</p>
                        <p className="text-[10px] font-bold text-outline">{selectedAsset.department} • {selectedAsset.position}</p>
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
              <p className="text-sm text-outline mb-6">Bạn đang thực hiện xóa <b>{selectedAsset.name}</b>. Hành động này sẽ được ghi nhật ký hệ thống bởi <b>{currentUser}</b>.</p>
              
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
                    onClick={() => handleDeleteAsset(selectedAsset.id)}
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
