"use client";

import { formatCurrency, formatDate, type Asset, DEPARTMENTS, CATEGORIES } from "@/lib/mockData";
import { fetchAssets, createAsset } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Tất cả"]);
  const [editableAssets, setEditableAssets] = useState<Asset[]>([]);

  // Dynamically derive categories and departments from live data
  const dynamicCategories = useMemo(() => {
    const cats = new Set(CATEGORIES.filter(c => c !== "Tất cả"));
    editableAssets.forEach(a => cats.add(a.category));
    return Array.from(cats).sort();
  }, [editableAssets]);

  const dynamicDepartments = useMemo(() => {
    const deps = new Set(DEPARTMENTS.filter(d => d !== "Tất cả"));
    editableAssets.forEach(a => deps.add(a.department));
    return Array.from(deps).sort();
  }, [editableAssets]);

  const dynamicGroups = useMemo(() => {
    const groups = new Set(["Thiết bị IT", "Thiết bị văn phòng", "Công cụ dụng cụ"]);
    editableAssets.forEach(a => groups.add(a.group_name));
    return Array.from(groups).sort();
  }, [editableAssets]);

  useEffect(() => {
    fetchAssets().then(data => {
      setEditableAssets(data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newAssetForm, setNewAssetForm] = useState({
    group_name: "Thiết bị IT",
    category: "Laptop",
    name: "",
    code: "",
    technicalSpecs: "",
    quantity: "1",
    user: "",
    position: "",
    department: "Công nghệ",
    handoverDate: new Date().toISOString().split('T')[0],
    handoverMinutesNo: "",
    price: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    vendor: "",
    warrantyPeriod: "24 tháng",
    depreciation_months: "24",
    notes: ""
  });

  const [customFields, setCustomFields] = useState({
    group_name: "",
    category: "",
    department: ""
  });

  const showCustom = {
    group_name: newAssetForm.group_name === "Khác...",
    category: newAssetForm.category === "Khác...",
    department: newAssetForm.department === "Khác..."
  };

  const currentUser = "Nguyễn Anh";

  const filteredAssets = selectedCategories.includes("Tất cả")
    ? editableAssets
    : editableAssets.filter(a => selectedCategories.includes(a.category) || selectedCategories.includes(a.group_name));

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetForm.name || !newAssetForm.code) {
      alert("Vui lòng điền đủ thông tin bắt buộc (Tên & Mã)!");
      return;
    }

    try {
      const asset: any = {
        group_name: showCustom.group_name ? customFields.group_name : newAssetForm.group_name,
        category: showCustom.category ? customFields.category : newAssetForm.category,
        name: newAssetForm.name,
        code: newAssetForm.code,
        technicalSpecs: newAssetForm.technicalSpecs,
        quantity: parseInt(newAssetForm.quantity) || 1,
        user: newAssetForm.user || "Chưa bàn giao",
        position: newAssetForm.position,
        department: showCustom.department ? customFields.department : newAssetForm.department,
        handoverDate: newAssetForm.handoverDate,
        handoverMinutesNo: newAssetForm.handoverMinutesNo,
        price: parseInt(newAssetForm.price) || 0,
        purchaseDate: newAssetForm.purchaseDate,
        vendor: newAssetForm.vendor,
        warrantyPeriod: newAssetForm.warrantyPeriod,
        depreciation_months: newAssetForm.depreciation_months,
        notes: newAssetForm.notes,
        status: "active",
        icon: (showCustom.category ? customFields.category : newAssetForm.category).toLowerCase().includes("laptop") ? "laptop_mac" : "inventory_2",
        iconColor: "indigo"
      };

      const newAsset = await createAsset(asset);
      setEditableAssets(prev => [newAsset, ...prev]);
      setIsAddModalOpen(false);
      setNewAssetForm({
        group_name: "Thiết bị IT", category: "Laptop",
        name: "", code: "", technicalSpecs: "", quantity: "1", user: "", position: "",
        department: "Công nghệ", handoverDate: new Date().toISOString().split('T')[0],
        handoverMinutesNo: "", price: "", purchaseDate: new Date().toISOString().split('T')[0],
        vendor: "", warrantyPeriod: "24 tháng", depreciation_months: "24", notes: ""
      });
      setCustomFields({ group_name: "", category: "", department: "" });
      alert("Đã thêm tài sản mới thành công!");
    } catch (error: any) {
      alert("Lỗi khi thêm tài sản: " + error.message);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Assets Catalog</span>
          <h2 className="text-4xl font-black text-on-surface mt-3">Kho Tài Sản</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface-container rounded-2xl p-1">
            {(["list", "grid"] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`p-2 rounded-xl ${viewMode === mode ? "bg-white text-primary shadow-sm" : "text-outline"}`}>
                <span className="material-symbols-outlined">{mode === "list" ? "view_list" : "grid_view"}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center gap-2">
            <span className="material-symbols-outlined">add</span> Thêm mới
          </button>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (cat === "Tất cả") setSelectedCategories(["Tất cả"]);
              else {
                const newSelection = selectedCategories.includes(cat) 
                  ? selectedCategories.filter(c => c !== cat) 
                  : [...selectedCategories.filter(c => c !== "Tất cả"), cat];
                setSelectedCategories(newSelection.length === 0 ? ["Tất cả"] : newSelection);
              }
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedCategories.includes(cat) ? "bg-primary text-white shadow-lg" : "bg-surface-container text-outline"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {viewMode === "list" ? (
            <div className="bg-white rounded-[2.5rem] shadow-soft border border-surface-container/30 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container">
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-outline">Tài sản</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-outline">Loại</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-outline">Đơn vị</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-outline">Người sử dụng</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredAssets.map(asset => (
                    <tr key={asset.id} className="group hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => { setSelectedAsset(asset); setIsModalOpen(true); }}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary`}>
                            <span className="material-symbols-outlined">{asset.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{asset.name}</p>
                            <p className="text-[10px] font-mono text-outline mt-0.5">{asset.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-outline">{asset.category}</td>
                      <td className="px-8 py-6 text-xs font-bold text-on-surface-variant">{asset.department}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                            {asset.user.split(" ").pop()?.substring(0, 1)}
                          </div>
                          <span className="text-xs font-bold">{asset.user}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="material-symbols-outlined text-outline group-hover:text-primary">visibility</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="bg-white p-6 rounded-[2rem] shadow-soft border border-surface-container/30 group cursor-pointer hover:border-primary/30 transition-all" onClick={() => { setSelectedAsset(asset); setIsModalOpen(true); }}>
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{asset.icon}</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">visibility</span>
                  </div>
                  <h4 className="text-sm font-black text-on-surface mb-1 truncate">{asset.name}</h4>
                  <p className="text-[10px] font-mono text-outline mb-4">{asset.code}</p>
                  <div className="pt-4 border-t border-surface-container flex justify-between items-center text-[10px] font-bold text-outline">
                    <span>{asset.department}</span>
                    <span>{asset.user}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">{selectedAsset.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{selectedAsset.name}</h3>
                    <p className="text-xs text-outline">{selectedAsset.code}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-outline mb-2">Trạng thái</p>
                  <StatusBadge status={selectedAsset.status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-outline mb-1">Dòng tài sản</p>
                    <p className="text-sm font-bold">{selectedAsset.group_name}</p>
                  </div>
                  <div className="p-4 bg-surface-container rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-outline mb-1">Loại</p>
                    <p className="text-sm font-bold">{selectedAsset.category}</p>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-primary mb-1">Thông số kỹ thuật</p>
                  <p className="text-sm italic">{selectedAsset.technicalSpecs || "Không có thông số."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-outline mb-1">Nguyên giá</p>
                    <p className="text-sm font-black text-primary">{formatCurrency(selectedAsset.price)}</p>
                  </div>
                  <div className="p-4 bg-surface-container rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-outline mb-1">Khấu hao</p>
                    <p className="text-sm font-bold">{selectedAsset.depreciation_months} tháng</p>
                  </div>
                </div>

                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-outline mb-1">Thông tin bàn giao</p>
                  <p className="text-sm font-bold">{selectedAsset.user} - {selectedAsset.department}</p>
                  <p className="text-[10px] text-outline mt-1 italic">Ngày: {formatDate(selectedAsset.handoverDate)}</p>
                </div>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="w-full mt-8 py-4 bg-surface-container-high rounded-2xl font-black">Đóng</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b flex justify-between items-center">
                <h3 className="text-2xl font-black">Thêm tài sản mới</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="h-10 w-10 bg-surface-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateAsset} className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Tên tài sản *</label>
                    <input required className="w-full bg-surface-container-low p-4 rounded-xl outline-none border focus:border-primary" placeholder="Tên sản phẩm..." value={newAssetForm.name} onChange={e => setNewAssetForm({...newAssetForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Mã tài sản *</label>
                    <input required className="w-full bg-surface-container-low p-4 rounded-xl outline-none border focus:border-primary" placeholder="VD: 12.03.01" value={newAssetForm.code} onChange={e => setNewAssetForm({...newAssetForm, code: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Dòng tài sản</label>
                    <div className="space-y-2">
                       <select className="w-full bg-surface-container-low p-4 rounded-xl outline-none" value={newAssetForm.group_name} onChange={e => setNewAssetForm({...newAssetForm, group_name: e.target.value})}>
                        {dynamicGroups.map(g => <option key={g} value={g}>{g}</option>)}
                        <option value="Khác...">Khác...</option>
                      </select>
                      {showCustom.group_name && (
                        <motion.input 
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                          className="w-full bg-primary/5 border border-primary/20 p-4 rounded-xl outline-none"
                          placeholder="Nhập dòng tài sản mới..."
                          value={customFields.group_name}
                          onChange={e => setCustomFields({...customFields, group_name: e.target.value})}
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Loại tài sản</label>
                    <div className="space-y-2">
                      <select className="w-full bg-surface-container-low p-4 rounded-xl outline-none" value={newAssetForm.category} onChange={e => setNewAssetForm({...newAssetForm, category: e.target.value})}>
                        {dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="Khác...">Khác...</option>
                      </select>
                      {showCustom.category && (
                        <motion.input 
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                          className="w-full bg-primary/5 border border-primary/20 p-4 rounded-xl outline-none"
                          placeholder="Nhập loại tài sản mới..."
                          value={customFields.category}
                          onChange={e => setCustomFields({...customFields, category: e.target.value})}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Số lượng</label>
                    <input type="number" className="w-full bg-surface-container-low p-4 rounded-xl outline-none" value={newAssetForm.quantity} onChange={e => setNewAssetForm({...newAssetForm, quantity: e.target.value})} />
                  </div>
                  <div className="space-y-1.5 text-xs font-bold flex flex-col justify-end">
                    {/* Placeholder to align with quantity if needed, or other field */}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-bold">
                  <label className="text-[10px] uppercase text-outline">Thông số kỹ thuật/Mô tả</label>
                  <textarea className="w-full bg-surface-container-low p-4 rounded-xl outline-none min-h-[100px]" placeholder="Chi tiết cấu hình..." value={newAssetForm.technicalSpecs} onChange={e => setNewAssetForm({...newAssetForm, technicalSpecs: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Đơn giá (VNĐ)</label>
                    <input type="number" className="w-full bg-surface-container-low p-4 rounded-xl outline-none" value={newAssetForm.price} onChange={e => setNewAssetForm({...newAssetForm, price: e.target.value})} />
                  </div>
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Thời hạn khấu hao (Tháng)</label>
                    <input type="number" className="w-full bg-surface-container-low p-4 rounded-xl outline-none" value={newAssetForm.depreciation_months} onChange={e => setNewAssetForm({...newAssetForm, depreciation_months: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Người sử dụng</label>
                    <input className="w-full bg-surface-container-low p-4 rounded-xl outline-none" placeholder="Họ tên..." value={newAssetForm.user} onChange={e => setNewAssetForm({...newAssetForm, user: e.target.value})} />
                  </div>
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] uppercase text-outline">Phòng ban</label>
                    <div className="space-y-2">
                      <select className="w-full bg-surface-container-low p-4 rounded-xl outline-none" value={newAssetForm.department} onChange={e => setNewAssetForm({...newAssetForm, department: e.target.value})}>
                        {dynamicDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                        <option value="Khác...">Khác...</option>
                      </select>
                      {showCustom.department && (
                        <motion.input 
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                          className="w-full bg-primary/5 border border-primary/20 p-4 rounded-xl outline-none"
                          placeholder="Nhập phòng ban mới..."
                          value={customFields.department}
                          onChange={e => setCustomFields({...customFields, department: e.target.value})}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 font-black text-outline">Hủy bỏ</button>
                  <button type="submit" className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20">Lưu hệ thống</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
