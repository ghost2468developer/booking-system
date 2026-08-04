import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role="admin" userName={user.name} />
      <div className="lg:pl-72">
        <main className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
