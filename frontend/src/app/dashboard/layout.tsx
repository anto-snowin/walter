import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#07090E] text-[#F8FAFC] relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient-glow bg-[#6366F1] top-[-100px] left-[-100px] opacity-20" />
      <div className="ambient-glow bg-[#06B6D4] bottom-[-150px] right-[-100px] opacity-15" />
      <div className="ambient-glow bg-[#8B5CF6] top-[40%] right-[10%] opacity-10" />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
