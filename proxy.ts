import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getSecret = () =>
  new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-in-production-min-32-chars"
  );

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/admin/login", "/api/admin/auth/login", "/api/admin/auth/logout"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  const token = request.cookies.get("admin-token")?.value;
  const isApi = pathname.startsWith("/api/admin");

  if (!token) {
    if (isApi) return Response.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    if (isApi) return Response.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
