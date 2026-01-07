"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {isLoginPage ? (
            <main className="min-h-screen bg-gray-100 flex items-center justify-center">
              {children}
            </main>
          ) : (
            /* FIX: Added h-screen and overflow-hidden here. 
               This locks the dashboard to exactly the window height.
            */
            <div className="flex h-screen overflow-hidden bg-gray-100 text-black">
              <Sidebar />
              {/* FIX: Added overflow-y-auto here. 
                 This makes only the content area scrollable.
              */}
              <main className="flex-1 p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}