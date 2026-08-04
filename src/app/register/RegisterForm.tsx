"use client";

import { registerAction } from "@/lib/actions/auth";
import { useActionState } from "react";
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await registerAction(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900"
            placeholder="John Doe"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
          Phone <span className="text-slate-400">(optional)</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900"
            placeholder="••••••••"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}
