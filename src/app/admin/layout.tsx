import { AdminSidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F7F4EF" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-7" style={{ backgroundColor: "#F2EFE9" }}>
        {children}
      </main>
    </div>
  );
}
