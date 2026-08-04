import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import type { ReactNode } from "react"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (user.role === "admin") redirect("/admin")

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role="user" userName={user.name} />
      <div className="lg:pl-72">
        <main className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}