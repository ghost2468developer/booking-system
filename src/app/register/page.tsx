import RegisterForm from "./RegisterForm"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const session = await getSession()
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-600/30">
            AF
          </div>
          <h1 className="text-3xl font-bold text-white">AutoFix Pro</h1>
          <p className="text-blue-200 mt-1">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign up</h2>
          <RegisterForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}