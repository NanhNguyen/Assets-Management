"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PageTransition from "./PageTransition";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    
    if (!token && !refresh && !isLoginPage) {
      router.push("/login");
    } else if ((token || refresh) && isLoginPage) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoginPage, router]);

  // Don't render protected content until we verify auth state
  if (!isAuthenticated && !isLoginPage) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
    </div>;
  }

  if (isLoginPage) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest p-4 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
