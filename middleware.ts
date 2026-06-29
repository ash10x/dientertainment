import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getSecret = () =>
  new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-in-production-min-32-chars"
  );

const PUBLIC_PATHS = new Set([
  "/admin/login",
  "/api/admin/auth/login",
  "/api/admin/auth/logout",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

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
