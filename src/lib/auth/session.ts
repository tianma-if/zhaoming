import { headers } from "next/headers";
import { getCookieCache } from "better-auth/cookies";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { getEnv, hasAuthEnv, hasDatabaseEnv } from "@/lib/env";

const getSessionWithProfile = cache(async () => {
  if (!hasAuthEnv() || !hasDatabaseEnv()) {
    return null;
  }

  const requestHeaders = await headers();
  return getSessionFromHeaders(requestHeaders);
});

export async function getSessionFromHeaders(requestHeaders: Headers) {
  if (!hasAuthEnv() || !hasDatabaseEnv()) {
    return null;
  }

  const env = getEnv();
  const cachedSession = (await getCookieCache(requestHeaders, {
    secret:
      env.BETTER_AUTH_SECRET ?? "development-placeholder-secret-change-me-123456",
  })) as Awaited<ReturnType<typeof auth.api.getSession>> | null;

  if (cachedSession?.user) {
    return cachedSession;
  }

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return null;
  }

  return session;
}

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
