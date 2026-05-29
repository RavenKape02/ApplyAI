"use client";

import { useState } from "react";

import { Sidebar } from "@/components/ui/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return (
        typeof window !== "undefined" &&
        localStorage.getItem("sidebar-collapsed") === "true"
      );
    } catch {
      return false;
    }
  });

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
