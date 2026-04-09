"use client";

import { assets, formatCurrency, formatDate, auditLogs } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function AssetDetailPage() {
  const params = useParams();
  const asset = assets.find((a) => a.id === params.id) ?? assets[0];
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editOldValue, setEditOldValue] = useState("");
  const [editNewValue, setEditNewValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const openEdit = (field: string, currentValue: string) => {
    setEditField(field);
    setEditOldValue(currentValue);
    setEditNewValue(currentValue);
    setSaving(false);
    setSaved(false);
    setShowEditModal(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setShowEditModal(false), 1200);
    }, 1500);
  };

  const relatedLogs = auditLogs.filter((l) => l.assetCode === asset.code);

  const infoSections = [
    {
      title: "Thông tin định danh",
      icon: "badge",
      fields: [
        { label: "Mã tài sản", value: asset.code, editable: false },
        { label: "Tên tài sản", value: asset.name, editable: false },
        { label: "Nhóm tài sản", value: asset.group, editable: false },
        { label: "Loại tài sản", value: asset.category, editable: false },
      ],
    },
    {
      title: "Thông tin sử dụng",
      icon: "person",
      fields: [
        { label: "Người sử dụng", value: asset.user || "Chưa gán", editable: true },
        { label: "Phòng ban", value: asset.department, editable: true },
        { label: "Chức danh", value: asset.position || "—", editable: true },
        { label: "Trạng thái", value: asset.status, editable: true },
      ],
    },
    {
      title: "Thông tin tài chính",
      icon: "payments",
      fields: [
        { label: "Đơn giá", value: formatCurrency(asset.price), editable: false },
        { label: "Ngày mua", value: formatDate(asset.purchaseDate), editable: false },
        { label: "Đơn vị bán", value: asset.vendor, editable: false },
        { label: "Hạn bảo hành", value: formatDate(asset.warrantyEnd), editable: false },
        { label: "Thời gian khấu hao", value: `${asset.depreciationYears} năm`, editable: false },
        { label: "Mức khấu hao", value: `${asset.depreciationRate}%/năm`, editable: false },
      ],
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">{asset.icon}</span>
          </div>
          <div>
            <p className="text-xs font-mono text-outline">{asset.code}</p>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface">{asset.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={asset.status} />
              <span className="text-sm text-on-surface-variant">{asset.department}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => openEdit("Người sử dụng", asset.user)}
          className="btn-primary flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          Chỉnh sửa
        </button>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {infoSections.map((section) => (
          <div key={section.title} className="card p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">{section.icon}</span>
              <h3 className="text-base font-bold text-on-surface">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">{field.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-on-surface">{field.value}</span>
                    {field.editable && (
                      <button
                        onClick={() => openEdit(field.label, String(field.value))}
                        className="p-1 text-outline hover:text-primary rounded transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notes */}
        <div className="card p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary">note</span>
            <h3 className="text-base font-bold text-on-surface">Ghi chú & Metadata</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">{asset.notes}</p>
        </div>
      </div>

      {/* Change History */}
      <div className="card p-5 lg:p-6">
        <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Lịch sử thay đổi
        </h3>
        {relatedLogs.length > 0 ? (
          <div className="space-y-4">
            {relatedLogs.map((log) => (
              <div key={log.id} className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-sm">
                    {log.action === "edit" ? "edit" : log.action === "create" ? "add" : "download"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{log.description}</p>
                  {log.field && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {log.field}: <span className="text-status-error line-through">{log.oldValue}</span> → <span className="text-status-success font-bold">{log.newValue}</span>
                    </p>
                  )}
                  <p className="text-xs text-outline mt-1">{log.user} • {formatDate(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-outline">Chưa có thay đổi nào được ghi nhận.</p>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-3xl shadow-glow-lg p-6 lg:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {saved ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-status-success text-3xl">check_circle</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface">Cập nhật thành công!</h3>
                <p className="text-sm text-on-surface-variant mt-2">Thay đổi đã được ghi log.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-on-surface mb-1">Chỉnh sửa có kiểm soát</h3>
                <p className="text-sm text-on-surface-variant mb-6">Mọi thay đổi đều được ghi log đầy đủ.</p>
                <div className="space-y-4">
                  <div>
                    <label className="label-text mb-1 block">Trường chỉnh sửa</label>
                    <p className="text-sm font-bold text-on-surface">{editField}</p>
                  </div>
                  <div>
                    <label className="label-text mb-1 block">Giá trị hiện tại</label>
                    <div className="p-3 bg-red-50 rounded-xl text-sm text-status-error font-medium">{editOldValue || "—"}</div>
                  </div>
                  <div>
                    <label className="label-text mb-1 block">Giá trị mới</label>
                    <input
                      className="input-field"
                      value={editNewValue}
                      onChange={(e) => setEditNewValue(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Hủy</button>
                  <button
                    onClick={handleSave}
                    disabled={saving || editNewValue === editOldValue}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang lưu...</>
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
