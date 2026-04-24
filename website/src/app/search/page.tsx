"use client";

import { formatCurrency, statusLabels, type Asset } from "@/lib/mockData";
import { fetchAssets } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"assets" | "personnel">("assets");
  const [assets, setAssets] = useState<Asset[]>([]);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
    }).catch(console.error);
  }, []);

  const stats = useMemo(() => {
    const totalValue = assets.reduce((sum, a) => sum + a.price, 0);
    return {
      totalAssets: assets.length,
      totalValue
    };
  }, [assets]);

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

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    setIsModalOpen(false);
  };

  const filteredAssets = assets.filter((a) => {
    const q = searchQuery.toLowerCase();
    const searchFields = [
      a.name,
      a.code,
      a.user,
      a.technicalSpecs,
      a.vendor,
      a.notes,
      a.handoverMinutesNo,
      a.group_name,
      a.category,
      a.manufacturer,
      a.position,
      a.department
    ].map(f => (f || "").toLowerCase());

    const matchesSearch = !searchQuery || searchFields.some(field => field.includes(q));
    const matchesFilter = activeFilter === "all" || a.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredPersonnel = personnel.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Explore Center</span>
          <h2 className="text-4xl font-black text-on-surface mt-3">Trung tâm Tra cứu</h2>
        </div>
        <div className="flex bg-surface-container rounded-2xl p-1">
          <button onClick={() => setActiveTab("assets")} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "assets" ? "bg-white text-primary shadow-sm" : "text-outline"}`}>Tài sản</button>
          <button onClick={() => setActiveTab("personnel")} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "personnel" ? "bg-white text-primary shadow-sm" : "text-outline"}`}>Nhân sự</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Tổng số tài sản", val: stats.totalAssets, icon: "inventory", color: "indigo" },
          { label: "Tổng giá trị", val: formatCurrency(stats.totalValue), icon: "payments", color: "sky" },
          { label: "Người sử dụng", val: personnel.length, icon: "group", color: "violet" }
        ].map((s, i) => (
          <div key={s.label} className="bg-white p-8 rounded-[2rem] shadow-soft border border-surface-container/50">
             <div className={`h-12 w-12 rounded-2xl bg-${s.color}-500/10 flex items-center justify-center mb-6`}>
              <span className={`material-symbols-outlined text-${s.color}-500`}>{s.icon}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">{s.label}</span>
            <h3 className="text-2xl font-black mt-1">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-soft border border-surface-container/30 overflow-hidden">
        <div className="p-8 border-b">
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input
              className="w-full bg-surface-container-low p-4 pl-14 rounded-2xl outline-none border focus:border-primary"
              placeholder={activeTab === "assets" ? "Tìm tài sản, serial, nhân viên..." : "Tìm nhân viên, phòng ban..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === "assets" && (
            <div className="flex gap-2">
              {["all", "active", "maintenance", "liquidated"].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? "bg-primary text-white" : "bg-surface-container text-outline"}`}>
                  {f === "all" ? "Tất cả" : statusLabels[f]}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === "assets" ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-[10px] font-black uppercase text-outline">
                <th className="px-8 py-5">Tài sản</th>
                <th className="px-8 py-5">Serial</th>
                <th className="px-8 py-5">Sử dụng</th>
                <th className="px-8 py-5">Trạng thái</th>
                <th className="px-8 py-5 text-right">Giá trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="cursor-pointer hover:bg-surface-container-low transition-colors" onClick={() => { setSelectedAsset(asset); setIsModalOpen(true); }}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{asset.icon}</span>
                      </div>
                      <span className="text-sm font-bold">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs">{asset.code}</td>
                  <td className="px-8 py-6 text-xs">{asset.user}</td>
                  <td className="px-8 py-6"><StatusBadge status={asset.status} /></td>
                  <td className="px-8 py-6 text-right font-black">{formatCurrency(asset.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPersonnel.map(person => (
              <div key={person.name} className="p-6 bg-surface-container-low rounded-[2rem] border border-surface-container">
                <h3 className="text-lg font-black">{person.name}</h3>
                <p className="text-xs text-outline mb-4">{person.department}</p>
                <div className="space-y-2">
                  {person.assets.map((a: any) => (
                    <div key={a.id} className="text-[10px] font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-primary">{a.icon}</span>
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-black mb-6">{selectedAsset.name}</h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container rounded-xl">
                    <p className="text-[10px] font-black uppercase text-outline mb-1">Nguyên giá</p>
                    <p className="font-black text-primary">{formatCurrency(selectedAsset.price)}</p>
                  </div>
                  <div className="p-4 bg-surface-container rounded-xl">
                    <p className="text-[10px] font-black uppercase text-outline mb-1">Khấu hao</p>
                    <p className="font-bold">{selectedAsset.depreciation_months} tháng</p>
                  </div>
                </div>
                <div className="p-4 bg-surface-container rounded-xl">
                  <p className="text-[10px] font-black uppercase text-outline mb-1">Thông số kỹ thuật</p>
                  <p className="italic">{selectedAsset.technicalSpecs || "Chưa cập nhật"}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-full mt-8 py-4 bg-surface-container-high rounded-2xl font-black">Đóng</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
