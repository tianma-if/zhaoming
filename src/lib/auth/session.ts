import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ensureUserProfile } from "@/lib/data";
import { hasAuthEnv, hasDatabaseEnv } from "@/lib/env";

export async function requireUser() {
  if (!hasAuthEnv() || !hasDatabaseEnv()) {
    redirect("/login");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  await ensureUserProfile(session.user);

  return session.user;
}

export async function getAuthSession() {
  if (!hasAuthEnv() || !hasDatabaseEnv()) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    await ensureUserProfile(session.user);
  }

  return session;
}
