import LoginForm from "./LoginForm";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-600/30">
            AF
          </div>
          <h1 className="text-3xl font-bold text-white">AutoFix Pro</h1>
          <p className="text-blue-200 mt-1">Car Repair & Maintenance Booking</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign in to your account</h2>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-xs">
                <p className="font-semibold text-slate-700">Admin</p>
                <p className="text-slate-500">admin@autofix.com</p>
                <p className="text-slate-500">admin123</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-xs">
                <p className="font-semibold text-slate-700">User</p>
                <p className="text-slate-500">user@example.com</p>
                <p className="text-slate-500">user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
