"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${enabled ? "bg-primary shadow-lg shadow-primary/20" : "bg-surface-container-high"
        }`}
    >
      <motion.span
        animate={{ x: enabled ? 24 : 4 }}
        className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
      />
    </button>
  );

  return (
    <div className="space-y-10 pb-20 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Preferences</span>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mt-4">
          Cài đặt hệ thống
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-soft border border-surface-container/30"
          >
            <h3 className="text-xl font-black text-on-surface mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
              Thông tin nhân sự
            </h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="h-28 w-28 rounded-3xl bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center text-primary text-4xl font-black shadow-inner border border-primary/5"
              >
                NA
              </motion.div>
              <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Họ và tên</label>
                    <input className="input-field !rounded-2xl !py-3.5" defaultValue="Admin" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Email nội bộ</label>
                    <input className="input-field !rounded-2xl !py-3.5" defaultValue="admin@netspace.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Phòng ban</label>
                    <input className="input-field !rounded-2xl !py-3.5 bg-surface-container-low/50" defaultValue="Công nghệ" disabled />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Cấp bậc</label>
                    <div className="flex items-center gap-3">
                      <input className="input-field !rounded-2xl !py-3.5 bg-surface-container-low/50" defaultValue="Quản trị viên" disabled />
                      <span className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg whitespace-nowrap uppercase tracking-tighter">
                        Full Access
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary !px-10 !py-4 shadow-xl shadow-primary/20"
                >
                  Lưu thay đổi
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-soft border border-surface-container/30"
          >
            <h3 className="text-xl font-black text-on-surface mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">palette</span>
              Cấu hình hiển thị
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-surface-container-low/50 rounded-3xl border border-surface-container group hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <span className="material-symbols-outlined">dark_mode</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Chế độ tối (Dark Mode)</p>
                    <p className="text-xs text-outline mt-0.5">Tối ưu hóa trải nghiệm vào ban đêm</p>
                  </div>
                </div>
                <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
              </div>

              <div className="flex items-center justify-between p-5 bg-surface-container-low/50 rounded-3xl border border-surface-container group hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                    <span className="material-symbols-outlined">translate</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Ngôn ngữ mặc định</p>
                    <p className="text-xs text-outline mt-0.5">Lựa chọn ngôn ngữ cho giao diện Plutus</p>
                  </div>
                </div>
                <select className="bg-white border border-surface-container rounded-xl px-4 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                  <option>Tiếng Việt (VN)</option>
                  <option>English (US)</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-container-low p-8 rounded-[2.5rem] border border-surface-container/50"
          >
            <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mark_email_unread</span>
              Thông báo
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-on-surface">Email Alert</p>
                  <p className="text-[10px] text-outline mt-0.5">Báo cáo tuần</p>
                </div>
                <Toggle enabled={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-on-surface">Desktop Push</p>
                  <p className="text-[10px] text-outline mt-0.5">Cảnh báo tức thời</p>
                </div>
                <Toggle enabled={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
              </div>
            </div>
          </motion.div>

          {/* Security Banner */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 rounded-[2.5rem] border border-amber-500/20"
          >
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 mb-6 shadow-sm">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h4 className="text-base font-black text-on-surface-variant mb-2">Bảo mật hệ thống</h4>
            <p className="text-xs font-semibold text-outline leading-relaxed mb-6">
              Mọi chỉnh sửa của bạn đều được ghi lại trong nhật ký hệ thống để đảm bảo tính minh bạch.
            </p>
            <button className="text-xs font-bold text-amber-600 hover:underline">Thay đổi mật khẩu</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
