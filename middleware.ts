// export { auth as middleware } from "@/auth"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Make sure this path is correct

export async function middleware(request: NextRequest) {
  const session = await auth();

  console.log("Session from middleware", session); // Debugging statement

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      console.log("No session, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRoles = session.user?.scope;
    console.log("User Roles:", userRoles); // Debugging statement

    // Ensure that userRoles is treated as an array for consistency
    const hasValidRole =
      userRoles === "super_admin" || userRoles === "store_admin";

    if (!hasValidRole) {
      console.log(
        "User does not have a valid role, redirecting to unauthorized"
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // If it's a store_admin trying to access general dashboard
    if (
      userRoles === "store_admin" &&
      request.nextUrl.pathname === "/dashboard"
    ) {
      console.log("Store admin redirected to store dashboard");
      return NextResponse.redirect(new URL("/dashboard/store/1", request.url));
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
