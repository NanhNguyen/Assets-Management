import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plutus | Asset Management",
  description: "Hệ thống quản lý tài sản nội bộ doanh nghiệp Plutus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="font-sans antialiased bg-background text-on-surface">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
            <Header />
            <PageTransition>
              <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
                {children}
              </main>
            </PageTransition>
          </div>
        </div>
      </body>
    </html>
  );
}
