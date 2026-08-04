import { prisma } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import StatusBadge from "@/components/ui/StatusBadge"
import BookingActions from "./BookingActions"
import { CalendarCheck, MessageSquare } from "lucide-react"
import Link from "next/link"

export default async function AdminBookingsPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") redirect("/login")

  const params = await searchParams
  const filter = params.filter || "all"

  const statusFilter =
    filter === "pending" ? { status: "pending" as const }
    : filter === "approved" ? { status: "approved" as const }
    : filter === "in_progress" ? { status: "in_progress" as const }
    : filter === "completed" ? { status: "completed" as const }
    : filter === "rejected" ? { status: "rejected" as const }
    : {}

  const allBookings = await prisma.booking.findMany({
    where: statusFilter,
    include: {
      user: { select: { name: true, email: true, phone: true } },
      vehicle: { select: { make: true, model: true, year: true, licensePlate: true } },
      bookingServices: {
        include: { service: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const counts = {
    all: await prisma.booking.count(),
    pending: await prisma.booking.count({ where: { status: "pending" } }),
    approved: await prisma.booking.count({ where: { status: "approved" } }),
    in_progress: await prisma.booking.count({ where: { status: "in_progress" } }),
    completed: await prisma.booking.count({ where: { status: "completed" } }),
    rejected: await prisma.booking.count({ where: { status: "rejected" } })
  }

  const tabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending Review", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "in_progress", label: "In Progress", count: counts.in_progress },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "rejected", label: "Rejected", count: counts.rejected }
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Bookings</h1>
        <p className="text-slate-500 mt-1">Review, approve, or reject customer booking requests</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/admin/bookings" : `/admin/bookings?filter=${tab.key}`}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                filter === tab.key
                  ? "bg-blue-500 text-white"
                  : tab.key === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {allBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <CalendarCheck className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {filter === "all" ? "No bookings yet" : `No ${filter.replace("_", " ")} bookings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allBookings.map((b) => (
            <div
              key={b.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                b.status === "pending"
                  ? "border-yellow-300 ring-1 ring-yellow-100"
                  : "border-slate-200"
              }`}
            >
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-800">{b.user.name}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-sm text-slate-500">{b.user.email}</p>
                    {b.user.phone && (
                      <p className="text-sm text-slate-400">{b.user.phone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      {new Date(b.scheduledDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-lg font-bold text-slate-800 mt-1">
                      {b.totalPrice ? `$${Number(b.totalPrice).toFixed(2)}` : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-slate-400 uppercase">Vehicle:</span>
                  <span className="text-sm text-slate-700">
                    {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                    {b.vehicle.licensePlate ? ` (${b.vehicle.licensePlate})` : ""}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {b.bookingServices.map((bs, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700"
                    >
                      {bs.service.name} · ${Number(bs.priceAtBooking).toFixed(2)}
                    </span>
                  ))}
                </div>

                {b.notes && (
                  <div className="flex items-start gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600 italic">{b.notes}</p>
                  </div>
                )}

                {b.adminNotes && (
                  <div className="bg-slate-50 rounded-lg px-4 py-2 mb-3">
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Your response</p>
                    <p className="text-sm text-slate-600">{b.adminNotes}</p>
                  </div>
                )}

                <BookingActions
                  bookingId={b.id}
                  currentStatus={b.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}