import { headers } from "next/headers";
import { getCookieCache } from "better-auth/cookies";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { getEnv, hasAuthEnv, hasDatabaseEnv, getAuthMode } from "@/lib/env";

const MOCK_USER = {
  id: "guest-user-id-00000000-0000-0000-0000-000000000000",
  name: "游客",
  email: "guest@zhaoming.local",
  emailVerified: true,
  image: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};

const getSessionWithProfile = cache(async () => {
  if (getAuthMode() === "none") {
    return {
      user: MOCK_USER,
      session: {
        id: "mock-session-id",
        userId: MOCK_USER.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        token: "mock-token",
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "mock-agent",
      },
    };
  }

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
