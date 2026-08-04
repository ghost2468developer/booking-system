import { prisma } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"
import EmptyState from "@/components/ui/EmptyState"
import { CalendarCheck, Car, Plus, MessageSquare } from "lucide-react"
import CancelBookingButton from "./CancelBookingButton"

export default async function BookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userBookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      vehicle: true,
      bookingServices: {
        include: { service: true }
      }
    },
    orderBy: { scheduledDate: "desc" }
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
          <p className="text-slate-500 mt-1">Track the status of your service requests</p>
        </div>
        <Link
          href="/dashboard/book"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Booking</span>
        </Link>
      </div>

      {userBookings.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="w-16 h-16" />}
          title="No bookings yet"
          description="Schedule your first service appointment to keep your car running smoothly."
          action={
            <Link
              href="/dashboard/book"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Book a Service
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {userBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {new Date(b.scheduledDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status} />
                    {b.totalPrice && (
                      <span className="text-lg font-bold text-slate-800">
                        R{Number(b.totalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status explanation for user */}
                {b.status === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 mb-3">
                    <p className="text-sm text-yellow-800">⏳ Waiting for admin to review and approve your booking.</p>
                  </div>
                )}
                {b.status === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-3">
                    <p className="text-sm text-red-800">❌ This booking was not approved by the shop.</p>
                  </div>
                )}
                {b.status === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-3">
                    <p className="text-sm text-green-800">✅ Your booking has been approved! Bring your car on the scheduled date.</p>
                  </div>
                )}
                {b.status === "in_progress" && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2.5 mb-3">
                    <p className="text-sm text-purple-800">🔧 Your vehicle is currently being serviced.</p>
                  </div>
                )}
                {b.status === "completed" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 mb-3">
                    <p className="text-sm text-blue-800">🎉 Service complete! Your vehicle is ready for pickup.</p>
                  </div>
                )}

                {/* Admin notes (rejection reason, etc.) */}
                {b.adminNotes && (
                  <div className="flex items-start gap-2 mb-3 bg-slate-50 rounded-lg px-4 py-2.5">
                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-0.5">Note from the shop</p>
                      <p className="text-sm text-slate-700">{b.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {b.bookingServices.map((bs, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700"
                    >
                      {bs.service.name} · R{Number(bs.priceAtBooking).toFixed(2)}
                    </span>
                  ))}
                </div>

                {b.notes && (
                  <p className="text-sm text-slate-500 italic">&ldquo;{b.notes}&rdquo;</p>
                )}

                {/* User can only cancel if still pending */}
                {b.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <CancelBookingButton bookingId={b.id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}