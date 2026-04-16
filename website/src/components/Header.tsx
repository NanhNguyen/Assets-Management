"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-4 w-full glass-header sticky top-0 z-30 shadow-sm border-b border-surface-container/30">
      <div className="flex items-center gap-4 lg:gap-12 flex-1">
        {/* Spacer for hamburger on mobile */}
        <div className="w-12 lg:hidden" />
        
        {/* Removed Logo from Header to prevent redundancy with Sidebar */}
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-outline rounded-xl transition-all relative"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </motion.button>
        </div>
        
        <div className="h-8 w-px bg-surface-container mx-1 hidden sm:block" />
        
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-600/20 cursor-pointer border border-white/20"
        >
          NA
        </motion.div>
      </div>
    </header>
  );
}
