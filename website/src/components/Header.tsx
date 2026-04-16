"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-4 w-full glass-header sticky top-0 z-30 shadow-sm border-b border-surface-container/30">
      <div className="flex items-center gap-4 lg:gap-12 flex-1">
        {/* Spacer for hamburger on mobile */}
        <div className="w-12 lg:hidden" />
        
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden lg:block text-2xl font-black tracking-tighter text-primary"
        >
          Plutus
        </motion.span>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">
            search
          </span>
          <input
            className="input-field !rounded-2xl !pl-14 bg-surface-container-low focus:bg-white focus:shadow-xl focus:shadow-primary/5 transition-all duration-300"
            placeholder="Tìm kiếm tài sản, mã serial, hoặc nhân sự..."
            type="text"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-surface-container rounded-md text-outline border border-surface-container-high">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-surface-container rounded-md text-outline border border-surface-container-high">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <div className="hidden sm:flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-outline rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-outline rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-2xl">help</span>
          </motion.button>
        </div>
        
        <div className="h-8 w-px bg-surface-container mx-1 hidden sm:block" />
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary hidden md:flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          Thêm Tài Sản
        </motion.button>

        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-primary font-bold text-sm shadow-inner cursor-pointer"
        >
          NA
        </motion.div>
      </div>
    </header>
  );
}
