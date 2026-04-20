"use client";

import { formatCurrency, formatDate, statusLabels, type Asset, ASSET_GROUPS, departments, WARRANTY_PERIODS, DEPRECIATION_RATES } from "@/lib/mockData";
import { fetchAssets } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Tất cả"]);
  const [editableAssets, setEditableAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssets().then(data => {
      setEditableAssets(data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // New states for specialized edits
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isWarrantyUpdateOpen, setIsWarrantyUpdateOpen] = useState(false);
  const [newWarrantyDate, setNewWarrantyDate] = useState("");

  // New state for adding asset
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAssetForm, setNewAssetForm] = useState({
    group: "Thiết bị IT",
    groupCode: "12",
    category: "Laptop",
    categoryCode: "12.03",
    name: "",
    code: "",
    technicalSpecs: "",
    quantity: "1",
    user: "",
    position: "",
    department: "Media",
    handoverDate: new Date().toISOString().split('T')[0],
    handoverMinutesNo: "",
    price: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    vendor: "",
    warrantyPeriod: "24 tháng",
    depreciationDuration: "",
    depreciationRate: "",
    notes: ""
  });

  const currentUser = "Nguyễn Anh"; // Placeholder for current logged in user

  const filterCategories = ["Tất cả", ...ASSET_GROUPS.map(g => g.name), ...ASSET_GROUPS.flatMap(g => g.categories.map(c => c.name))];

  const filteredAssets = selectedCategories.includes("Tất cả")
    ? editableAssets
    : editableAssets.filter(a => selectedCategories.includes(a.category) || selectedCategories.includes(a.group));

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

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetForm.name || !newAssetForm.code) {
      alert("Vui lòng điền đủ thông tin bắt buộc (Tên & Mã)!");
      return;
    }

    const asset: Asset = {
      id: Date.now().toString(),
      group: newAssetForm.group,
      groupCode: newAssetForm.groupCode,
      category: newAssetForm.category,
      categoryCode: newAssetForm.categoryCode,
      name: newAssetForm.name,
      code: newAssetForm.code,
      technicalSpecs: newAssetForm.technicalSpecs,
      quantity: parseInt(newAssetForm.quantity) || 1,
      user: newAssetForm.user || "Chưa bàn giao",
      position: newAssetForm.position,
      department: newAssetForm.department,
      handoverDate: newAssetForm.handoverDate,
      handoverMinutesNo: newAssetForm.handoverMinutesNo,
      price: parseInt(newAssetForm.price) || 0,
      purchaseDate: newAssetForm.purchaseDate,
      vendor: newAssetForm.vendor,
      warrantyPeriod: newAssetForm.warrantyPeriod,
      depreciationDuration: newAssetForm.depreciationDuration,
      depreciationRate: parseFloat(newAssetForm.depreciationRate) || 0,
      notes: newAssetForm.notes,
      status: "active",
      manufacturer: "Chưa cập nhật",
      icon: newAssetForm.category.toLowerCase().includes("laptop") ? "laptop_mac" : "inventory_2",
      iconColor: "indigo",
      warrantyEnd: newAssetForm.handoverDate // Simulating calculation
    };

    setEditableAssets(prev => [asset, ...prev]);
    logEvent("create", asset);
    setIsAddModalOpen(false);
    setNewAssetForm({
      group: "Thiết bị IT", groupCode: "12", category: "Laptop", categoryCode: "12.03",
      name: "", code: "", technicalSpecs: "", quantity: "1", user: "", position: "",
      department: "Media", handoverDate: new Date().toISOString().split('T')[0],
      handoverMinutesNo: "", price: "", purchaseDate: new Date().toISOString().split('T')[0],
      vendor: "", warrantyPeriod: "24 tháng", depreciationDuration: "", depreciationRate: "", notes: ""
    });
    alert("Đã thêm tài sản mới thành công!");
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
            onClick={() => setIsAddModalOpen(true)}
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
        className="flex flex-wrap gap-4 mt-8"
      >
        {filterCategories.map((cat: string) => {
          const isActive = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => {
                if (cat === "Tất cả") {
                  setSelectedCategories(["Tất cả"]);
                } else {
                  let newSelection = selectedCategories.filter(c => c !== "Tất cả");
                  if (isActive) {
                    newSelection = newSelection.filter(c => c !== cat);
                    if (newSelection.length === 0) newSelection = ["Tất cả"];
                  } else {
                    newSelection = [...newSelection, cat];
                  }
                  setSelectedCategories(newSelection);
                }
              }}
              className={`px-8 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${
                isActive
                  ? "bg-primary text-white shadow-xl shadow-primary/30 active:scale-95"
                  : "bg-surface-container hover:bg-surface-container-high text-outline active:scale-95"
              }`}
            >
              {cat}
            </button>
          );
        })}
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

                <div className="space-y-8 overflow-y-auto pr-2" style={{ maxHeight: '60vh' }}>
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

                  {/* Core Mapping Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="col-span-2 p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Nhóm (Mã)</p>
                      <p className="text-sm font-bold text-on-surface">{selectedAsset.group} ({selectedAsset.groupCode})</p>
                    </div>
                    <div className="col-span-2 p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Loại (Mã)</p>
                      <p className="text-sm font-bold text-on-surface">{selectedAsset.category} ({selectedAsset.categoryCode})</p>
                    </div>
                  </div>

                  <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">qr_code</span>
                      Mã tài sản (Mã TS/CCDC)
                    </p>
                    <p className="text-sm font-mono font-black text-primary">{selectedAsset.code}</p>
                  </div>

                  {/* Technical & Specs */}
                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">terminal</span>
                      Thông số kỹ thuật & Mô tả
                    </p>
                    <p className="text-sm font-medium text-on-surface leading-relaxed italic">
                      {selectedAsset.technicalSpecs || "Không có thông tin kỹ thuật."}
                    </p>
                  </div>

                  {/* Distribution Info */}
                  <div className="p-6 bg-surface-container-low rounded-[2rem] border border-surface-container/50">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-[11px] font-black uppercase text-outline tracking-wider">Thông tin bàn giao</h5>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-full">BBBG: {selectedAsset.handoverMinutesNo || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-lg font-black shadow-inner">
                        {selectedAsset.user.split(" ").pop()?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-black text-on-surface">{selectedAsset.user}</p>
                        <p className="text-xs font-bold text-outline">{selectedAsset.position} • {selectedAsset.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 pt-4 border-t border-surface-container/30">
                      <div>
                        <p className="text-[9px] font-black text-outline uppercase mb-0.5">Ngày bàn giao</p>
                        <p className="text-xs font-bold text-on-surface">{formatDate(selectedAsset.handoverDate)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-outline uppercase mb-0.5">Số lượng (SL)</p>
                        <p className="text-xs font-bold text-on-surface">{selectedAsset.quantity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Giá trị (Chưa VAT)</p>
                      <p className="text-sm font-black text-on-surface">{formatCurrency(selectedAsset.price)}</p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Thời gian mua</p>
                      <p className="text-sm font-bold text-on-surface">{formatDate(selectedAsset.purchaseDate)}</p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Hạn bảo hành</p>
                      <p className="text-sm font-bold text-on-surface">{selectedAsset.warrantyPeriod}</p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Khấu hao / Mức</p>
                      <p className="text-sm font-bold text-on-surface">{selectedAsset.depreciationDuration || "N/A"} / {selectedAsset.depreciationRate}%</p>
                    </div>
                  </div>

                  <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container/50">
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Đơn vị bán (Vendor)</p>
                    <p className="text-sm font-bold text-on-surface text-primary">{selectedAsset.vendor || "Chưa cập nhật"}</p>
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
      {/* Create Asset Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
            >
              <div className="p-10 border-b border-surface-container shrink-0 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-on-surface">Thêm tài sản mới</h3>
                  <p className="text-sm text-outline font-bold mt-1 uppercase tracking-widest text-primary">Nhập liệu theo chuẩn Excel Plutus</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-12 w-12 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateAsset} className="p-10 overflow-y-auto space-y-12">
                {/* Section 1: Core Info */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-8 w-1.5 bg-primary rounded-full" />
                    <h4 className="text-lg font-black text-on-surface">Thông tin cơ bản</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Nhóm tài sản/CCDC</label>
                      <select 
                        className="input-field !rounded-2xl bg-white" 
                        value={newAssetForm.group} 
                        onChange={e => {
                          const group = ASSET_GROUPS.find(g => g.name === e.target.value);
                          setNewAssetForm({ 
                            ...newAssetForm, 
                            group: e.target.value, 
                            groupCode: group?.code || "",
                            category: group?.categories[0].name || "",
                            categoryCode: group?.categories[0].code || ""
                          });
                        }}
                      >
                        {ASSET_GROUPS.map(g => <option key={g.code} value={g.name}>{g.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Mã Nhóm</label>
                      <input className="input-field !rounded-2xl font-mono" placeholder="VD: 12" value={newAssetForm.groupCode} onChange={e => setNewAssetForm({ ...newAssetForm, groupCode: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Số lượng (SL)</label>
                      <input type="number" className="input-field !rounded-2xl" placeholder="1" value={newAssetForm.quantity} onChange={e => setNewAssetForm({ ...newAssetForm, quantity: e.target.value })} />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Loại tài sản/CCDC</label>
                      <select 
                        className="input-field !rounded-2xl bg-white" 
                        value={newAssetForm.category} 
                        onChange={e => {
                          const group = ASSET_GROUPS.find(g => g.name === newAssetForm.group);
                          const cat = group?.categories.find(c => c.name === e.target.value);
                          setNewAssetForm({ 
                            ...newAssetForm, 
                            category: e.target.value, 
                            categoryCode: cat?.code || "" 
                          });
                        }}
                      >
                        {ASSET_GROUPS.find(g => g.name === newAssetForm.group)?.categories.map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Mã Loại</label>
                      <input className="input-field !rounded-2xl font-mono" placeholder="VD: 12.03" value={newAssetForm.categoryCode} onChange={e => setNewAssetForm({ ...newAssetForm, categoryCode: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1 text-primary">Tên tài sản/CCDC *</label>
                      <input required className="input-field !rounded-2xl border-primary/20 bg-primary/5" placeholder="Tên sản phẩm..." value={newAssetForm.name} onChange={e => setNewAssetForm({ ...newAssetForm, name: e.target.value })} />
                    </div>
                    <div className="col-span-1 md:col-span-3 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Mã TS/CCDC</label>
                      <input className="input-field !rounded-2xl font-mono" placeholder="VD: 12.03.01" value={newAssetForm.code} onChange={e => setNewAssetForm({ ...newAssetForm, code: e.target.value })} />
                    </div>
                  </div>
                </section>

                {/* Section 2: Technical & Specs */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-8 w-1.5 bg-sky-500 rounded-full" />
                    <h4 className="text-lg font-black text-on-surface">Thông số & Ghi chú</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Thông số kỹ thuật/Mô tả</label>
                      <textarea className="w-full bg-surface-container-low border border-surface-container rounded-3xl p-5 text-sm min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Chi tiết cấu hình..." value={newAssetForm.technicalSpecs} onChange={e => setNewAssetForm({ ...newAssetForm, technicalSpecs: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Ghi chú</label>
                      <textarea className="w-full bg-surface-container-low border border-surface-container rounded-3xl p-5 text-sm min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Lưu ý thêm..." value={newAssetForm.notes} onChange={e => setNewAssetForm({ ...newAssetForm, notes: e.target.value })} />
                    </div>
                  </div>
                </section>

                {/* Section 3: Distribution */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-8 w-1.5 bg-amber-500 rounded-full" />
                    <h4 className="text-lg font-black text-on-surface">Cấp phát & Bàn giao</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Người sử dụng</label>
                      <input className="input-field !rounded-2xl" placeholder="Họ và tên..." value={newAssetForm.user} onChange={e => setNewAssetForm({ ...newAssetForm, user: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Chức danh</label>
                      <input className="input-field !rounded-2xl" placeholder="VD: Nhân viên/Quản lý" value={newAssetForm.position} onChange={e => setNewAssetForm({ ...newAssetForm, position: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Phòng ban</label>
                      <select 
                        className="input-field !rounded-2xl bg-white" 
                        value={newAssetForm.department} 
                        onChange={e => setNewAssetForm({ ...newAssetForm, department: e.target.value })}
                      >
                        {departments.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Ngày bàn giao / Thu hồi</label>
                      <input type="date" className="input-field !rounded-2xl" value={newAssetForm.handoverDate} onChange={e => setNewAssetForm({ ...newAssetForm, handoverDate: e.target.value })} />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Số BBBG / Thu hồi</label>
                      <input className="input-field !rounded-2xl" placeholder="VD: 01/25/BBBG" value={newAssetForm.handoverMinutesNo} onChange={e => setNewAssetForm({ ...newAssetForm, handoverMinutesNo: e.target.value })} />
                    </div>
                  </div>
                </section>

                {/* Section 4: Finance */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-8 w-1.5 bg-emerald-500 rounded-full" />
                    <h4 className="text-lg font-black text-on-surface">Tài chính & Khấu hao</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Đơn giá (Chưa VAT)</label>
                      <input type="number" className="input-field !rounded-2xl" placeholder="0" value={newAssetForm.price} onChange={e => setNewAssetForm({ ...newAssetForm, price: e.target.value })} />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Thời gian mua</label>
                      <input type="date" className="input-field !rounded-2xl" value={newAssetForm.purchaseDate} onChange={e => setNewAssetForm({ ...newAssetForm, purchaseDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Đơn vị bán</label>
                      <input className="input-field !rounded-2xl" placeholder="Vendor..." value={newAssetForm.vendor} onChange={e => setNewAssetForm({ ...newAssetForm, vendor: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Hạn bảo hành</label>
                      <select 
                        className="input-field !rounded-2xl bg-white" 
                        value={newAssetForm.warrantyPeriod} 
                        onChange={e => setNewAssetForm({ ...newAssetForm, warrantyPeriod: e.target.value })}
                      >
                        {WARRANTY_PERIODS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Thời gian tính khấu hao</label>
                      <select 
                        className="input-field !rounded-2xl bg-white" 
                        value={newAssetForm.depreciationDuration} 
                        onChange={e => setNewAssetForm({ ...newAssetForm, depreciationDuration: e.target.value })}
                      >
                        <option value="">Không tính khấu hao</option>
                        <option value="2 năm">2 năm (50%/năm)</option>
                        <option value="3 năm">3 năm (33.3%/năm)</option>
                        <option value="5 năm">5 năm (20%/năm)</option>
                        <option value="10 năm">10 năm (10%/năm)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-outline ml-1">Mức khấu hao (%)</label>
                      <select 
                        className="input-field !rounded-2xl bg-white" 
                        value={newAssetForm.depreciationRate} 
                        onChange={e => setNewAssetForm({ ...newAssetForm, depreciationRate: e.target.value })}
                      >
                        {DEPRECIATION_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </div>
                  </div>
                </section>

                <div className="flex gap-6 pt-10 border-t border-surface-container shrink-0">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 font-black text-outline hover:text-on-surface transition-all">Hủy bỏ</button>
                  <button type="submit" className="flex-[2] py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all">Lưu tài sản vào hệ thống</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
