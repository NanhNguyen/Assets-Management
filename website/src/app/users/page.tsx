"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { 
    id: "admin", 
    label: "Quản trị viên hệ thống", 
    desc: "Toàn quyền quản lý người dùng, tài sản và cấu hình hệ thống.",
    icon: "admin_panel_settings",
    color: "bg-primary"
  },
  { 
    id: "manager", 
    label: "Quản lý tài sản / Kho", 
    desc: "Thao tác nghiệp vụ tài sản. Không có quyền xóa cứng hoặc quản lý người dùng.",
    icon: "inventory_2",
    color: "bg-orange-500"
  },
  { 
    id: "auditor", 
    label: "Kế toán / Kiểm toán", 
    desc: "Chỉ xem dữ liệu, theo dõi khấu hao và xuất báo cáo. Không thể chỉnh sửa.",
    icon: "assessment",
    color: "bg-emerald-500"
  }
];

export default function UsersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "auditor"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role !== "admin") {
        router.push("/");
      } else {
        setIsAdmin(true);
        fetchUsers();
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/auth/update-role`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId, role })
      });
      if (res.ok) {
        fetchUsers();
        setMessage({ type: "success", text: "Cập nhật quyền thành công!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi cập nhật quyền" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/auth/delete-user`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        fetchUsers();
        setMessage({ type: "success", text: "Đã xóa tài khoản thành công!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi xóa tài khoản" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/auth/create-user`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể cấp tài khoản");

      setMessage({ type: "success", text: "Cấp tài khoản thành công!" });
      setFormData({ email: "", password: "", fullName: "", role: "auditor" });
      fetchUsers();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header>
        <p className="label-text">Quản trị nhân sự</p>
        <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-on-surface mt-1">
          Cấp quyền & Tài khoản
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Container */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8 lg:p-10 border-none shadow-xl shadow-black/[0.03]"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Họ và tên nhân viên</label>
                  <input
                    required
                    className="input-field"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Email truy cập</label>
                  <input
                    required
                    type="email"
                    className="input-field"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Mật khẩu khởi tạo</label>
                <input
                  required
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Phân quyền hệ thống</label>
                <div className="grid grid-cols-1 gap-3">
                  {ROLE_OPTIONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id })}
                      className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all text-left ${formData.role === r.id ? 'border-primary bg-primary/5' : 'border-surface-container bg-white hover:border-outline/30'}`}
                    >
                      <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white ${r.color}`}>
                        <span className="material-symbols-outlined text-xl">{r.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-on-surface">{r.label}</p>
                        <p className="text-xs text-outline font-medium mt-0.5 leading-relaxed">{r.desc}</p>
                      </div>
                      <div className={`ml-auto mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.role === r.id ? 'border-primary' : 'border-outline/20'}`}>
                        {formData.role === r.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={isLoading}
                className="btn-primary w-full py-5 !rounded-[2rem] text-sm font-black shadow-xl shadow-primary/20 flex justify-center items-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">person_add</span>
                    Xác nhận & Cấp tài khoản
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-primary-fixed-dim bg-gradient-to-br from-primary-fixed-dim to-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
             <div className="relative z-10">
               <span className="material-symbols-outlined text-emerald-300 mb-4 text-3xl">security</span>
               <h3 className="text-xl font-black mb-3 italic">Lưu ý bảo mật</h3>
               <p className="text-sm font-medium text-white/80 leading-relaxed mb-6">
                 Khi cấp tài khoản mới, hệ thống sẽ tự động kích hoạt trạng thái "Stable". Hãy yêu cầu nhân viên đổi mật khẩu ngay trong lần đăng nhập đầu tiên tại mục Cài đặt.
               </p>
               <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Quy tắc đặt tên</p>
                  <p className="text-xs font-bold">Email phải thuộc tên miền công ty (@netspace.com)</p>
               </div>
             </div>
          </div>

          <div className="card p-8 rounded-[2.5rem] border-none shadow-soft bg-surface-container-low">
             <h4 className="text-xs font-black uppercase tracking-widest text-outline mb-6">Thống kê nhân sự</h4>
             <div className="space-y-6">
                {[
                  { label: "Quản trị viên", count: 1, color: "bg-primary" },
                  { label: "Quản lý kho", count: 12, color: "bg-orange-500" },
                  { label: "Kế toán", count: 4, color: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${item.color}`} />
                      <span className="text-sm font-bold text-on-surface">{item.label}</span>
                    </div>
                    <span className="text-sm font-black">{item.count}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* User List Table */}
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-on-surface">Danh sách nhân sự</h3>
            <p className="text-xs font-bold text-outline uppercase tracking-widest mt-1">Quản lý quyền hạn & Trạng thái</p>
          </div>
          <div className="px-4 py-2 bg-surface-container-low rounded-full border border-surface-container text-xs font-bold">
            Tổng cộng: {users.length} thành viên
          </div>
        </header>

        <div className="card overflow-hidden border-none shadow-xl shadow-black/[0.02]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-outline">Thành viên</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-outline">Phân quyền</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-outline">Ngày tạo</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-outline text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-primary/[0.02] transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-black uppercase">
                          {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface">{user.full_name || "Chưa đặt tên"}</p>
                          <p className="text-xs font-medium text-outline">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <select 
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="bg-surface-container-low border border-surface-container rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                      >
                        {ROLE_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-medium text-outline">
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                        title="Xóa tài khoản"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <span className="material-symbols-outlined text-4xl text-outline/30">group_off</span>
              <p className="text-sm font-bold text-outline">Chưa có nhân sự nào trong danh sách</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
