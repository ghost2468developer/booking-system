import { prisma } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import ServiceManager from "./ServiceManager"

export default async function AdminServicesPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") redirect("/login")

  const allServices = await prisma.service.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }]
  })

  // Serialize for client component
  const serialized = allServices.map((s) => ({
    ...s,
    price: String(s.price),
    createdAt: s.createdAt.toISOString()
  }))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <ServiceManager services={serialized} />
    </div>
  )
}