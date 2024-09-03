// export { auth as middleware } from "@/auth"
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {auth} from "@/auth"; // Make sure this path is correct

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
        const hasEventOrganizerRole = Array.isArray(userRoles)
            ? userRoles.includes("super_admin")
            : userRoles === "super_admin";

        if (!hasEventOrganizerRole) {
            console.log(
                "User does not have the ROLE_EVENT_ORGANIZER, redirecting to unauthorized"
            );
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }
    return NextResponse.next();
}

export const config = {

    matcher: ["/dashboard/:path*", "/login", "/register", "/user/:path*", "/events/:path*"],
};