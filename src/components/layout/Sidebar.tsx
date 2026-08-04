"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Wrench,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function Sidebar({
  role,
  userName,
}: {
  role: "admin" | "user";
  userName: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/admin/bookings", label: "Bookings", icon: <CalendarCheck className="w-5 h-5" /> },
    { href: "/admin/services", label: "Services", icon: <Wrench className="w-5 h-5" /> },
    { href: "/admin/customers", label: "Customers", icon: <Users className="w-5 h-5" /> },
  ];

  const userNavItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/dashboard/bookings", label: "My Bookings", icon: <CalendarCheck className="w-5 h-5" /> },
    { href: "/dashboard/vehicles", label: "My Vehicles", icon: <Car className="w-5 h-5" /> },
    { href: "/dashboard/book", label: "Book Service", icon: <Wrench className="w-5 h-5" /> },
  ];

  const navItems = role === "admin" ? adminNavItems : userNavItems;

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/20">
            AF
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">AutoFix Pro</h1>
            <p className="text-xs text-slate-400 capitalize">{role} Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              isActive(item.href)
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {isActive(item.href) && <ChevronRight className="w-4 h-4 opacity-60" />}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-semibold">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            AF
          </div>
          <span className="font-bold text-white">AutoFix Pro</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2 hover:bg-slate-700 rounded-lg"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-800 transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-slate-800">
        {sidebarContent}
      </div>
    </>
  );
}
