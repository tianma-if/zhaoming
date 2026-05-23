import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { protectedPrefixes } from "@/lib/constants";
import { hasAuthEnv } from "@/lib/env";

export function proxy(request: NextRequest) {
  if (!hasAuthEnv()) {
    return NextResponse.next();
  }

  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionToken = getSessionCookie(request.headers);

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/divinations/:path*", "/profile/:path*"],
};
