"use client";

import { assets, departments, formatCurrency, formatDate, summaryStats } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || a.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <p className="label-text">Quản lý Tập trung</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mt-1">
            Trung tâm Tra cứu
          </h2>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">download</span>
          Export Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 lg:p-6 card-hover">
          <span className="label-text">Tổng số tài sản</span>
          <h3 className="text-3xl font-black text-on-surface mt-2">{summaryStats.totalAssets.toLocaleString("vi-VN")}</h3>
          <p className="text-sm font-medium text-primary mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>+12%
          </p>
        </div>
        <div className="card p-5 lg:p-6 card-hover">
          <span className="label-text">Tổng giá trị</span>
          <h3 className="text-2xl lg:text-3xl font-black text-on-surface mt-2">42.5 tỷ đ</h3>
          <p className="text-sm font-medium text-on-surface-variant mt-1">VNĐ</p>
        </div>
        <div className="card p-5 lg:p-6 card-hover">
          <span className="label-text">Người sử dụng</span>
          <h3 className="text-3xl font-black text-on-surface mt-2">{summaryStats.activeUsers}</h3>
          <p className="text-sm font-medium text-on-surface-variant mt-1">đang hoạt động</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Filters + Table */}
        <div className="xl:col-span-9">
          <div className="card overflow-hidden">
            {/* Search + Filters */}
            <div className="p-4 lg:p-6 border-b border-surface-container">
              <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  className="input-field !pl-12"
                  placeholder="Tìm theo tên tài sản, mã, người sử dụng…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="btn-secondary flex items-center gap-2 !py-2">
                  <span className="material-symbols-outlined text-lg">tune</span>
                  Bộ lọc
                </button>
                <div className="h-6 w-px bg-surface-container mx-1 hidden sm:block" />
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "active", label: "Đang sử dụng" },
                  { key: "maintenance", label: "Bảo trì" },
                  { key: "unused", label: "Chưa sử dụng" },
                  { key: "liquidated", label: "Thanh lý" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`filter-chip ${activeFilter === f.key ? "filter-chip-active" : "filter-chip-inactive"}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="table-header border-b border-surface-container">
                    <th className="px-6 py-4">Tên Tài Sản</th>
                    <th className="px-6 py-4">Mã TS</th>
                    <th className="px-6 py-4">Phòng Ban</th>
                    <th className="px-6 py-4">Ngày Mua</th>
                    <th className="px-6 py-4">Trạng Thái</th>
                    <th className="px-6 py-4">Giá Trị</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/50">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="group hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl bg-${asset.iconColor}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className={`material-symbols-outlined text-${asset.iconColor}-600 text-lg`}>{asset.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{asset.name}</p>
                            <p className="text-xs text-outline font-medium">{asset.manufacturer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">{asset.code}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-3 py-1 bg-surface-container-high rounded-full">{asset.department}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{formatDate(asset.purchaseDate)}</td>
                      <td className="px-6 py-4"><StatusBadge status={asset.status} /></td>
                      <td className="px-6 py-4 text-sm font-bold text-on-surface">{formatCurrency(asset.price)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-outline hover:text-primary">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-surface-container/50">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">{asset.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{asset.name}</p>
                    <p className="text-xs text-outline font-mono">{asset.code}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={asset.status} />
                      <span className="text-xs font-bold text-on-surface">{formatCurrency(asset.price)}</span>
                    </div>
                  </div>
                  <button className="p-2 text-outline hover:text-primary">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="p-4 lg:p-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs font-bold text-outline uppercase tracking-wider">
                Hiển thị 1 - {filteredAssets.length} của {summaryStats.totalAssets.toLocaleString("vi-VN")} tài sản
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-surface-container-low rounded-lg text-outline hover:text-primary disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`h-9 w-9 font-bold rounded-lg text-sm ${
                      p === 1 ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-2 text-outline">...</span>
                <button className="h-9 w-9 bg-surface-container-low text-on-surface-variant font-bold rounded-lg text-sm hover:bg-surface-container">42</button>
                <button className="p-2 bg-surface-container-low rounded-lg text-outline hover:text-primary">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Insight Panel */}
        <div className="xl:col-span-3 space-y-4">
          {/* Dept Distribution */}
          <div className="card p-5 lg:p-6">
            <h4 className="text-sm font-bold text-on-surface mb-4">Phân bổ phòng ban</h4>
            <div className="space-y-3">
              {departments.slice(0, 5).map((dept) => (
                <div key={dept.code}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-on-surface-variant">{dept.name}</span>
                    <span className="text-xs font-bold text-on-surface">{dept.assetCount}</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${dept.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="card p-5 lg:p-6">
            <h4 className="text-sm font-bold text-on-surface mb-4">Top người giữ TS</h4>
            <div className="space-y-3">
              {["Nguyễn Hoàng Em", "Nguyễn Văn An", "Trần Thị Bình"].map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {name.split(" ").pop()?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{name}</p>
                    <p className="text-xs text-outline">{[5, 3, 2][i]} tài sản</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Value */}
          <div className="card p-5 lg:p-6">
            <h4 className="text-sm font-bold text-on-surface mb-4">Top giá trị cao</h4>
            <div className="space-y-3">
              {assets.sort((a, b) => b.price - a.price).slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-on-surface-variant truncate flex-1 mr-2">{a.name}</p>
                  <span className="text-xs font-bold text-primary whitespace-nowrap">{formatCurrency(a.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
