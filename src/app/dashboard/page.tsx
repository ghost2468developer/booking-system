import { prisma } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"
import { CalendarCheck, Car, Clock, Plus, AlertCircle } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userVehicles = await prisma.vehicle.findMany({
    where: { userId: user.id }
  })

  const userBookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { vehicle: true },
    orderBy: { scheduledDate: "desc" }
  })

  const pendingBookings = userBookings.filter((b) => b.status === "pending")
  const activeBookings = userBookings.filter(
    (b) => b.status === "approved" || b.status === "in_progress"
  )
  const completedBookings = userBookings.filter((b) => b.status === "completed")

  const upcomingBookings = userBookings
    .filter(
      (b) =>
        b.status !== "completed" &&
        b.status !== "cancelled" &&
        b.status !== "rejected"
    )
    .slice(0, 5)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here&apos;s your vehicle service overview</p>
        </div>
        <Link
          href="/dashboard/book"
          className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Book Service
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-800">{pendingBookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-800">{activeBookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Completed</p>
              <p className="text-xl font-bold text-slate-800">{completedBookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Vehicles</p>
              <p className="text-xl font-bold text-slate-800">{userVehicles.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Your Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No active bookings</p>
            <p className="text-sm text-slate-400 mb-4">Schedule a service for your vehicle</p>
            <Link
              href="/dashboard/book"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Book Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcomingBookings.map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {b.vehicle.make} {b.vehicle.model}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(b.scheduledDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <StatusBadge status={b.status} />
                {b.totalPrice && (
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                    ${Number(b.totalPrice).toFixed(2)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        href="/dashboard/book"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors z-30"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  )
}