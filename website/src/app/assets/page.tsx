"use client";

import { assets, formatCurrency, formatDate, statusLabels } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "excel">("list");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [editableAssets, setEditableAssets] = useState([...assets]);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const categories = ["Tất cả", "Máy tính", "Máy in", "Nội thất", "Màn hình", "Dây cáp HDMI", "Bình hoa"];

  const filteredAssets = selectedCategory === "Tất cả" 
    ? editableAssets 
    : editableAssets.filter(a => a.category === selectedCategory || a.group === selectedCategory);

  const handleExcelChange = (id: string, field: string, value: string) => {
    setEditableAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const saveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Đã lưu tất cả thay đổi và ghi nhận vào lịch sử hệ thống!");
    }, 1000);
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
            {(["list", "grid", "excel"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2.5 rounded-xl transition-all relative flex items-center gap-2 ${viewMode === mode ? "text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
              >
                {viewMode === mode && (
                  <motion.div layoutId="view-bg" className="absolute inset-0 bg-white rounded-xl -z-10" />
                )}
                <span className="material-symbols-outlined text-xl">
                  {mode === "list" ? "view_list" : mode === "grid" ? "grid_view" : "table_chart"}
                </span>
                {viewMode === mode && <span className="text-[10px] font-black uppercase tracking-widest pr-1">
                  {mode === "excel" ? "Excel Mode" : ""}
                </span>}
              </button>
            ))}
          </div>
          
          {viewMode === "excel" ? (
             <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={saveChanges}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 px-6 py-3.5 shadow-lg shadow-primary/20 bg-green-600 border-green-700 hover:bg-green-700"
              >
                <span className="material-symbols-outlined text-xl">{isSaving ? "sync" : "save"}</span>
                {isSaving ? "Đang lưu..." : "Lưu tất cả"}
              </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 px-6 py-3.5 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-xl">add_box</span>
              Thêm mới
            </motion.button>
          )}
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
                        <button 
                          className="p-2.5 bg-surface-container-low rounded-xl text-outline hover:text-primary transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit logic here if needed
                          }}
                        >
                          <span className="material-symbols-outlined text-lg">edit_square</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          /* Excel Spreadsheet Mode */
          <motion.div 
            key="excel"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-[2.5rem] shadow-2xl border border-primary/20 overflow-hidden"
          >
            <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <span className="text-xs font-black uppercase tracking-widest text-primary">Chế độ Chỉnh sửa Tập trung (Excel Mode)</span>
              </div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-tighter italic">Nhấn vào các ô để chỉnh sửa giá trị trực tiếp</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-[11px] font-black uppercase tracking-widest text-outline border-b border-surface-container">
                    <td className="px-4 py-3 border-r border-surface-container">STT</td>
                    <td className="px-4 py-3 border-r border-surface-container min-w-[200px]">Tên Tài Sản</td>
                    <td className="px-4 py-3 border-r border-surface-container min-w-[120px]">Mã Serial</td>
                    <td className="px-4 py-3 border-r border-surface-container min-w-[150px]">Người Sử Dụng</td>
                    <td className="px-4 py-3 border-r border-surface-container min-w-[140px]">Phòng Ban</td>
                    <td className="px-4 py-3 border-r border-surface-container min-w-[160px]">Trạng Thái</td>
                    <td className="px-4 py-3 min-w-[150px]">Ghi chú</td>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset, i) => (
                    <tr key={asset.id} className="border-b border-surface-container transition-colors hover:bg-primary/5 font-mono text-[12px]">
                      <td className="px-4 py-2 border-r border-surface-container text-center text-outline bg-surface-container-lowest">{i + 1}</td>
                      <td className="px-4 py-2 border-r border-surface-container">
                        <input 
                          readOnly
                          value={asset.name}
                          className="w-full bg-transparent p-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded cursor-not-allowed text-on-surface/50"
                        />
                      </td>
                      <td className="px-4 py-2 border-r border-surface-container font-black text-primary">{asset.code}</td>
                      <td className="px-4 py-2 border-r border-surface-container">
                        <input 
                          value={asset.user}
                          onChange={(e) => handleExcelChange(asset.id, "user", e.target.value)}
                          className="w-full bg-transparent p-1 px-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded border border-transparent hover:border-surface-container-high transition-all"
                        />
                      </td>
                      <td className="px-4 py-2 border-r border-surface-container">
                        <select 
                          value={asset.department}
                          onChange={(e) => handleExcelChange(asset.id, "department", e.target.value)}
                          className="w-full bg-transparent p-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded border border-transparent hover:border-surface-container-high appearance-none transition-all"
                        >
                          {["Công nghệ", "Kinh doanh", "Media", "Truyền thông số", "Marketing", "SEO", "MCN"].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2 border-r border-surface-container">
                        <select 
                          value={asset.status}
                          onChange={(e) => handleExcelChange(asset.id, "status", e.target.value)}
                          className={`w-full bg-transparent p-1 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded border border-transparent hover:border-surface-container-high appearance-none transition-all ${
                            asset.status === "liquidated" ? "text-red-500" : asset.status === "maintenance" ? "text-amber-500" : "text-green-600"
                          }`}
                        >
                          {Object.entries(statusLabels).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          value={asset.notes || ""}
                          onChange={(e) => handleExcelChange(asset.id, "notes", e.target.value)}
                          placeholder="Nhập ghi chú..."
                          className="w-full bg-transparent p-1 px-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded border border-transparent hover:border-surface-container-high transition-all"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container-low/50 flex items-center gap-2">
               <span className="material-symbols-outlined text-sm text-outline">info</span>
               <p className="text-[10px] font-bold text-outline uppercase tracking-widest italic">Hệ thống tự động đồng bộ thay đổi và ghi nhật ký chỉnh sửa khi nhấn Lưu.</p>
            </div>
          </motion.div>
        )}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        Ngày được bàn giao
                      </p>
                      <p className="text-sm font-bold text-on-surface">{formatDate(selectedAsset.purchaseDate)}</p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">qr_code</span>
                        Mã sản phẩm
                      </p>
                      <p className="text-sm font-mono font-black text-primary">{selectedAsset.code}</p>
                    </div>
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
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      Người đang sử dụng
                    </p>
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
                  className="w-full mt-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
