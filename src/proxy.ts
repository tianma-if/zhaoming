import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { hasAuthEnv } from "@/lib/env";
import { protectedPrefixes } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  if (!hasAuthEnv()) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
