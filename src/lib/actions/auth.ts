"use server";

import { prisma } from "@/db";
import bcryptjs from "bcryptjs";
import { createSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = await bcryptjs.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  await createSession(user.id, user.role);
  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;

  if (!email || !password || !name) {
    return { error: "Name, email, and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, name, phone, role: "user" },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
