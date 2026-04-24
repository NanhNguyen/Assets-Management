"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { DEPARTMENTS } from "@/lib/mockData";

export default function SettingsPage() {
  const router = useRouter();
  
  // Persistence states
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [language, setLanguage] = useState("Tiếng Việt (VN)");
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Quản trị viên",
    email: "admin@netspace.com",
    role: "Quản trị viên hệ thống",
    department: "Công nghệ",
    lastLogin: "Hôm nay, 08:30"
  });

  // Load persistence on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("settings_darkMode") === "true";
    const savedEmailNotif = localStorage.getItem("settings_emailNotif") !== "false";
    const savedPushNotif = localStorage.getItem("settings_pushNotif") !== "false";
    const savedLanguage = localStorage.getItem("settings_language") || "Tiếng Việt (VN)";
    
    setDarkMode(savedDarkMode);
    setEmailNotif(savedEmailNotif);
    setPushNotif(savedPushNotif);
    setLanguage(savedLanguage);

    // Try to get user email from local storage or token
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        // Simple base64 decode for demo
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.email) {
          setUserProfile(prev => ({ 
            ...prev, 
            email: payload.email,
            name: payload.email.split("@")[0].toUpperCase()
          }));
        }
      } catch (e) {
        console.error("Token decode error", e);
      }
    }
  }, []);

  // Save persistence when values change
  useEffect(() => {
    localStorage.setItem("settings_darkMode", String(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => localStorage.setItem("settings_emailNotif", String(emailNotif)), [emailNotif]);
  useEffect(() => localStorage.setItem("settings_pushNotif", String(pushNotif)), [pushNotif]);
  useEffect(() => localStorage.setItem("settings_language", language), [language]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    router.push("/login");
  };


  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">User Account</span>
        <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-6">
          Hồ sơ cá nhân
        </h2>
        <p className="text-sm text-outline mt-2">Quản lý thông tin tài khoản và phiên đăng nhập</p>
      </motion.div>

      <div className="max-w-3xl mx-auto w-full">
        {/* Profile Card - Centered and Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-soft border border-surface-container/30 relative"
        >
          <div className="absolute top-0 right-0 p-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-green-600 uppercase">Đang trực tuyến</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="h-36 w-36 rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary/20 border-4 border-white"
              >
                {userProfile.name.substring(0, 2)}
              </motion.div>
              <button className="absolute -bottom-2 -right-2 h-11 w-11 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border border-surface-container">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </button>
            </div>

            <div className="w-full space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Họ và tên</label>
                  <input className="input-field !rounded-2xl !py-4 shadow-sm border-surface-container text-center sm:text-left" defaultValue={userProfile.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Email nội bộ</label>
                  <div className="px-5 py-4 bg-surface-container-low/50 rounded-2xl border border-surface-container flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm text-outline">mail</span>
                    <span className="text-sm font-bold text-on-surface opacity-70 cursor-not-allowed leading-none">{userProfile.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Chức vụ quản trị</label>
                  <div className="px-5 py-4 bg-surface-container-low/50 rounded-2xl border border-surface-container flex items-center justify-between">
                    <span className="text-sm font-bold text-on-surface opacity-70 leading-none">{userProfile.role}</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black rounded-lg uppercase">System</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Phòng ban</label>
                  <select 
                    className="input-field !rounded-2xl !py-4 shadow-sm border-surface-container bg-white" 
                    value={userProfile.department}
                    onChange={e => setUserProfile({ ...userProfile, department: e.target.value })}
                  >
                    {DEPARTMENTS.filter(d => d !== "Tất cả").map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-5 bg-primary text-white font-black rounded-[2rem] shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:brightness-110 transition-all border border-primary"
                >
                  Cập nhật hồ sơ
                </motion.button>
                <motion.button
                  onClick={() => setIsLogoutModalOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-5 bg-red-50 text-red-600 font-black rounded-[2rem] border-2 border-red-100 flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  Đăng xuất
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center"
            >
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">logout</span>
              </div>
              <h3 className="text-2xl font-black text-on-surface mb-2">Đăng xuất?</h3>
              <p className="text-sm font-semibold text-outline mb-8">
                Bạn có chắc chắn muốn kết thúc phiên làm việc này không?
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all"
                >
                  Đăng xuất ngay
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full py-4 font-black text-outline hover:text-on-surface transition-all"
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
