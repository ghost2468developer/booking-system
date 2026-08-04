import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wrench, CalendarCheck, Shield, Clock, ChevronRight, Car, Star } from "lucide-react";

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/20">
              AF
            </div>
            <span className="font-bold text-lg text-slate-800">AutoFix Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-800 px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Trusted by 500+ car owners
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Your car deserves
            <br />
            <span className="text-blue-600">expert care</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Book professional car repair and maintenance services online. Fast scheduling,
            transparent pricing, and quality workmanship guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Book a Service
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-medium text-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Why choose AutoFix Pro?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              We make car maintenance simple, transparent, and stress-free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Easy Booking</h3>
              <p className="text-sm text-slate-500">
                Schedule your service in minutes with our simple online booking system.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Transparent Pricing</h3>
              <p className="text-sm text-slate-500">
                Know exactly what you&apos;ll pay before you book. No hidden fees, ever.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Expert Mechanics</h3>
              <p className="text-sm text-slate-500">
                Our certified technicians handle everything from oil changes to engine repairs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Real-time Updates</h3>
              <p className="text-sm text-slate-500">
                Track your service status from booking to completion in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Car className="w-12 h-12 text-blue-200 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get your car serviced?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join hundreds of satisfied customers who trust AutoFix Pro for their
            car maintenance needs.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            Create Free Account
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              AF
            </div>
            <span className="font-semibold text-slate-300">AutoFix Pro</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} AutoFix Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
