"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Tài sản", icon: "account_balance_wallet" },
  { href: "/search", label: "Tra cứu", icon: "search_insights" },
  { href: "/audit", label: "Lịch sử", icon: "history_edu" },
  { href: "/reports", label: "Báo cáo", icon: "assessment" },
  { href: "/settings", label: "Cài đặt", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserRole(user.role);
      } catch (e) {
        console.error("Parse error", e);
      }
    }
  }, []);

  console.log("Current Sidebar Role:", userRole);

  const baseNavItems = [
    { href: "/", label: "Tài sản", icon: "account_balance_wallet" },
    { href: "/search", label: "Tra cứu", icon: "search_insights" },
    { href: "/audit", label: "Lịch sử", icon: "history_edu" },
    { href: "/reports", label: "Báo cáo", icon: "assessment" },
  ];

  const footerNavItems = [
    { href: "/settings", label: "Cài đặt", icon: "settings" },
  ];

  const finalNavItems = [...baseNavItems];
  
  // Hiển thị tab Nhân sự cho Admin hoặc khi chưa load kịp role để bạn có quyền quản lý
  if (userRole === "admin" || !userRole) {
    finalNavItems.push({ href: "/users", label: "Nhân sự", icon: "group" });
  }

  finalNavItems.push(...footerNavItems);


  const sidebarContent = (
    <>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-10 px-2"
      >
        <Link href="/">
          <h1 className="text-2xl font-black gradient-text tracking-tighter cursor-pointer">Plutus</h1>
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline mt-1 opacity-70">
          Enterprise Asset Suite
        </p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {finalNavItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="relative group outline-none"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all relative z-10 ${isActive ? "text-primary shadow-sm" : "text-outline hover:text-on-surface hover:bg-surface-container"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 border border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className="material-symbols-outlined text-xl transition-transform group-hover:scale-110"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>


      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <div className="px-5 py-4 bg-primary/5 rounded-[2rem] border border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Status</span>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-status-success/40" />
            </div>
          </div>
          <p className="text-[11px] font-bold text-on-surface-variant mt-2">v2.4.0 • Stable</p>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-50 p-3 bg-white rounded-2xl shadow-glow text-primary flex items-center justify-center border border-primary/5"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile (slide-in) */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-surface-container-low z-50 flex flex-col p-8 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "translate-x-0" : "-translate-x-full shadow-none"
          } shadow-2xl`}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 right-6 p-2 text-outline bg-surface-container rounded-xl hover:text-on-surface"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined">close</span>
        </motion.button>
        {sidebarContent}
      </aside>

      {/* Sidebar - Desktop (fixed) */}
      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-low z-30 flex-col p-8 border-r border-surface-container/50">
        {sidebarContent}
      </aside>
    </>
  );
}
