import { prisma } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Mail, Phone, Car, CalendarCheck } from "lucide-react";

export default async function AdminCustomersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/login");

  const allUsers = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          vehicles: true,
          bookings: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <p className="text-slate-500 mt-1">
          {allUsers.length} registered user{allUsers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {allUsers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No customers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800">{u.name}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {u.email}
                </p>
                {u.phone && (
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {u.phone}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Car className="w-4 h-4 text-slate-400" />
                  {u._count.vehicles} vehicle{u._count.vehicles !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarCheck className="w-4 h-4 text-slate-400" />
                  {u._count.bookings} booking{u._count.bookings !== 1 ? "s" : ""}
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3">
                Joined {new Date(u.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
