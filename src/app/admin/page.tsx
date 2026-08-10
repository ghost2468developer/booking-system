import { prisma } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import StatusBadge from "@/components/ui/StatusBadge"
import Link from "next/link"
import { CalendarCheck, Users, DollarSign, Wrench, ChevronRight, AlertCircle, Clock } from "lucide-react"

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") redirect("/login")

  const totalBookings = await prisma.booking.count()
  const totalUsers = await prisma.user.count({ where: { role: "user" } })
  const totalServices = await prisma.service.count()
  const pendingCount = await prisma.booking.count({ where: { status: "pending" } })
  const inProgressCount = await prisma.booking.count({ where: { status: "in_progress" } })

  const completedBookings = await prisma.booking.findMany({
    where: { status: "completed" },
    select: { totalPrice: true }
  })
  const revenue = completedBookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)

  const recentBookings = await prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      vehicle: { select: { make: true, model: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 8
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your auto repair shop</p>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <Link
          href="/admin/bookings?filter=pending"
          className="flex items-center gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6 hover:bg-yellow-100 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-yellow-200 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-yellow-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-yellow-800">
              {pendingCount} booking{pendingCount !== 1 ? "s" : ""} awaiting your review
            </p>
            <p className="text-sm text-yellow-600">Click to review and approve or reject</p>
          </div>
          <ChevronRight className="w-5 h-5 text-yellow-400 group-hover:text-yellow-600" />
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Bookings</p>
              <p className="text-xl font-bold text-slate-800">{totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-800">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">In Progress</p>
              <p className="text-xl font-bold text-slate-800">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Revenue</p>
              <p className="text-xl font-bold text-slate-800">R{revenue.toFixed(0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Customers</p>
              <p className="text-xl font-bold text-slate-800">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-left font-medium text-slate-500">Customer</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500">Vehicle</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{b.user.name}</p>
                      <p className="text-xs text-slate-400">{b.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {b.vehicle.make} {b.vehicle.model}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(b.scheduledDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">
                    {b.totalPrice ? `R${Number(b.totalPrice).toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}