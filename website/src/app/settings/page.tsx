"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-surface-container-high"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 lg:space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <p className="label-text">Cá nhân hoá</p>
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mt-1">
          Cài đặt
        </h2>
      </div>

      {/* Profile */}
      <div className="card p-5 lg:p-6">
        <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Thông tin cá nhân
        </h3>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
            NA
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text mb-1 block">Họ và tên</label>
                <input className="input-field" defaultValue="Nguyễn Văn Admin" />
              </div>
              <div>
                <label className="label-text mb-1 block">Email</label>
                <input className="input-field" defaultValue="admin@netspace.com" />
              </div>
              <div>
                <label className="label-text mb-1 block">Phòng ban</label>
                <input className="input-field" defaultValue="Phòng Công nghệ" disabled />
              </div>
              <div>
                <label className="label-text mb-1 block">Vai trò</label>
                <div className="flex items-center gap-2">
                  <input className="input-field" defaultValue="Admin" disabled />
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full flex-shrink-0">
                    Toàn quyền
                  </span>
                </div>
              </div>
            </div>
            <button className="btn-primary mt-2">Lưu thay đổi</button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card p-5 lg:p-6">
        <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">palette</span>
          Giao diện
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div>
              <p className="text-sm font-bold text-on-surface">Chế độ tối</p>
              <p className="text-xs text-outline mt-0.5">Sử dụng giao diện tối cho hệ thống</p>
            </div>
            <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div>
              <p className="text-sm font-bold text-on-surface">Ngôn ngữ</p>
              <p className="text-xs text-outline mt-0.5">Ngôn ngữ hiển thị hệ thống</p>
            </div>
            <select className="bg-transparent border border-outline-variant rounded-xl px-3 py-1.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20">
              <option>Tiếng Việt</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-5 lg:p-6">
        <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications</span>
          Thông báo
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div>
              <p className="text-sm font-bold text-on-surface">Email thông báo</p>
              <p className="text-xs text-outline mt-0.5">Nhận thông báo qua email khi có thay đổi</p>
            </div>
            <Toggle enabled={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div>
              <p className="text-sm font-bold text-on-surface">Push notification</p>
              <p className="text-xs text-outline mt-0.5">Nhận thông báo đẩy trên trình duyệt</p>
            </div>
            <Toggle enabled={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
          </div>
        </div>
      </div>

      {/* Roles Info */}
      <div className="card p-5 lg:p-6">
        <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
          Phân quyền
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { role: "Admin", perms: ["Toàn quyền", "Tạo / sửa tài sản", "Xem log"], color: "bg-primary/10 text-primary" },
            { role: "Kế toán", perms: ["Xem dữ liệu", "Xuất Excel", "Không được sửa"], color: "bg-secondary/10 text-secondary" },
            { role: "Nhân viên", perms: ["Chỉ xem tài sản của mình"], color: "bg-outline/10 text-on-surface-variant" },
          ].map((r) => (
            <div key={r.role} className="p-4 bg-surface-container-low rounded-2xl">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.color}`}>{r.role}</span>
              <ul className="mt-3 space-y-1.5">
                {r.perms.map((p) => (
                  <li key={p} className="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-outline">check</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
