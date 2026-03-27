"use client";

import BottomNav from "@/components/layout/BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="pb-[72px] min-h-screen">{children}</main>
      <BottomNav />
    </>
  );
}