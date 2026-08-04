import { prisma } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import VehicleList from "./VehicleList"

export default async function VehiclesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userVehicles = await prisma.vehicle.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" }
  })

  // Serialize for client component (Prisma returns Date objects)
  const serialized = userVehicles.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString()
  }))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <VehicleList vehicles={serialized} />
    </div>
  )
}