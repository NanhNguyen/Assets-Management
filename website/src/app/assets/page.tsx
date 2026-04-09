"use client";

import { assets, formatCurrency, formatDate } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <p className="label-text">Danh mục quản lý</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mt-1">
            Tài sản
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-container-low rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-soft text-primary" : "text-outline"}`}
            >
              <span className="material-symbols-outlined text-lg">view_list</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-soft text-primary" : "text-outline"}`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm mới
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {["Tất cả", "Máy tính", "Máy in", "Nội thất", "Server", "IoT", "Mạng"].map((cat, i) => (
          <button
            key={cat}
            className={`filter-chip ${i === 0 ? "filter-chip-active" : "filter-chip-inactive"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="card p-5 card-hover group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary">{asset.icon}</span>
                </div>
                <StatusBadge status={asset.status} />
              </div>
              <h4 className="text-sm font-bold text-on-surface mb-1 line-clamp-1">{asset.name}</h4>
              <p className="text-xs text-outline font-mono mb-3">{asset.code}</p>
              <div className="flex items-center justify-between pt-3 border-t border-surface-container/50">
                <span className="text-xs text-on-surface-variant">{asset.department}</span>
                <span className="text-sm font-bold text-primary">{formatCurrency(asset.price)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="table-header border-b border-surface-container">
                  <th className="px-6 py-4">Tên Tài Sản</th>
                  <th className="px-6 py-4">Mã</th>
                  <th className="px-6 py-4">Loại</th>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Phòng</th>
                  <th className="px-6 py-4">Giá trị</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/50">
                {assets.map((asset) => (
                  <tr key={asset.id} className="group hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-lg">{asset.icon}</span>
                        </div>
                        <p className="text-sm font-bold text-on-surface">{asset.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-on-surface-variant">{asset.code}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{asset.category}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{asset.user || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 bg-surface-container-high rounded-full">{asset.department}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">{formatCurrency(asset.price)}</td>
                    <td className="px-6 py-4"><StatusBadge status={asset.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors text-outline hover:text-primary">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile */}
          <div className="md:hidden divide-y divide-surface-container/50">
            {assets.map((asset) => (
              <div key={asset.id} className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">{asset.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={asset.status} />
                    <span className="text-xs font-bold">{formatCurrency(asset.price)}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
