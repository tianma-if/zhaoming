import { NextResponse, type NextRequest } from "next/server";
import { parseSetCookieHeader, toCookieOptions } from "better-auth/cookies";
import { auth } from "@/lib/auth";
import { hasAuthEnv } from "@/lib/env";
import { protectedPrefixes } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  if (!hasAuthEnv()) {
    return NextResponse.next();
  }

  const sessionResult = await auth.api.getSession({
    headers: request.headers,
    returnHeaders: true,
  });
  const session = sessionResult.response;
  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();
  const setCookieHeader = sessionResult.headers?.get("set-cookie");

  if (setCookieHeader) {
    const parsedCookies = parseSetCookieHeader(setCookieHeader);

    parsedCookies.forEach((cookie, name) => {
      if (!name) {
        return;
      }

      response.cookies.set(name, cookie.value, toCookieOptions(cookie));
    });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/divinations/:path*", "/profile/:path*"],
};
