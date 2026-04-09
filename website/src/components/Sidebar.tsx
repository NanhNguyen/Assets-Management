"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Tổng quan", icon: "dashboard" },
  { href: "/search", label: "Tra cứu", icon: "search_insights" },
  { href: "/assets", label: "Tài sản", icon: "account_balance_wallet" },
  { href: "/audit", label: "Lịch sử", icon: "history_edu" },
  { href: "/reports", label: "Báo cáo", icon: "assessment" },
  { href: "/settings", label: "Cài đặt", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-lg font-black gradient-text">NetSpace Assets</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline mt-1">
          Enterprise Asset Suite
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={isActive ? "nav-item-active" : "nav-item"}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-6">
        <div className="px-4 py-3 bg-primary/5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-primary">Hệ thống</span>
            <div className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">Hoạt động ổn định</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-glow"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile (slide-in) */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-surface-container-low z-50 flex flex-col p-6 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-outline hover:text-on-surface"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {sidebarContent}
      </aside>

      {/* Sidebar - Desktop (fixed) */}
      <aside className="hidden lg:flex h-screen w-72 fixed left-0 top-0 bg-surface-container-low z-40 flex-col p-6">
        {sidebarContent}
      </aside>
    </>
  );
}
