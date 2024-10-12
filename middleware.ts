import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  console.log("Session from middleware", session);

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      console.log("No session, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = session.user?.role;
    console.log("User Role:", userRole);

    if (userRole === "user") {
      console.log("User role detected, redirecting to home page");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (userRole !== "super_admin" && userRole !== "store_admin") {
      console.log(
        "User does not have a valid role, redirecting to unauthorized"
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // If it's a store_admin trying to access general dashboard
    if (userRole === "store_admin") {
      const storeId = session.user.store_id;
      if (!storeId) {
        console.log("store admin doesn't have a store id");
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      if (request.nextUrl.pathname === "/dashboard") {
        console.log(`store admin redirected to store dashboard: ${storeId}`);
        return NextResponse.redirect(
          new URL(`/dashboard/stores/${storeId}`, request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/user/:path*",
    "/events/:path*",
  ],
};
