import { prisma } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import BookingForm from "./BookingForm"
import Link from "next/link"
import { Car, Plus } from "lucide-react"

export default async function BookPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userVehicles = await prisma.vehicle.findMany({
    where: { userId: user.id }
  })

  const activeServices = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }]
  })

  // Serialize Decimal to string for client component
  const serializedVehicles = userVehicles.map((v) => ({
    id: v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    licensePlate: v.licensePlate
  }))

  const serializedServices = activeServices.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: String(s.price),
    durationMinutes: s.durationMinutes,
    category: s.category
  }))

  if (userVehicles.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Book a Service</h1>
        <p className="text-slate-500 mb-8">You need to add a vehicle first</p>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No vehicles found</h3>
          <p className="text-sm text-slate-500 mb-6">Add a vehicle to your account before booking a service.</p>
          <Link
            href="/dashboard/vehicles"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add a Vehicle
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Book a Service</h1>
      <p className="text-slate-500 mb-8">Select your vehicle, choose services, and pick a date</p>
      <BookingForm vehicles={serializedVehicles} services={serializedServices} />
    </div>
  )
}