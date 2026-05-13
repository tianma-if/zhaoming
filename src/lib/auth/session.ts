import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { ensureUserProfile } from "@/lib/data";
import { hasAuthEnv, hasDatabaseEnv } from "@/lib/env";

const getSessionWithProfile = cache(async () => {
  if (!hasAuthEnv() || !hasDatabaseEnv()) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  await ensureUserProfile(session.user);

  return session;
});

export async function requireUser() {
  const session = await getSessionWithProfile();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

export async function getAuthSession() {
  return getSessionWithProfile();
}
