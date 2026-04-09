"use client";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-3 w-full glass-header sticky top-0 z-30 shadow-glow">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        {/* Spacer for hamburger on mobile */}
        <div className="w-10 lg:hidden" />
        <span className="hidden lg:block text-xl font-extrabold tracking-tighter text-primary">
          NetSpace Zenith
        </span>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="input-field !rounded-full !pl-12"
            placeholder="Tra cứu mã tài sản, tên thiết bị hoặc phòng ban..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="p-2 text-outline hover:bg-surface-container-low rounded-full transition-all hidden sm:block">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-outline hover:bg-surface-container-low rounded-full transition-all hidden sm:block">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-px bg-surface-container hidden sm:block" />
        <button className="btn-primary hidden md:flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Thêm Tài Sản
        </button>
        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          NA
        </div>
      </div>
    </header>
  );
}
