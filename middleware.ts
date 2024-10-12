
// export { auth as middleware } from "@/auth"
import {NextResponse} from "next/server";
import { auth } from "@/auth"; // Make sure this path is correct

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    // Public routes accessible to all users
    const publicRoutes = ['/login', '/register', '/reset-password', '/']
    if (publicRoutes.includes(nextUrl.pathname)) {
        return NextResponse.next()
    }

    // Routes that require authentication
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl))
    }

    // Role-based access control
    const { role, store_id } = req.auth?.user || {}

    if (nextUrl.pathname.startsWith('/dashboard')) {
        if (role === 'super_admin') {
            // Super admins can access all dashboard routes
            return NextResponse.next()
        } else if (role === 'store_admin') {
            // Check if the route is a store-specific dashboard
            if (nextUrl.pathname.startsWith('/dashboard/stores/')) {
                // Extract store ID from the URL
                const urlStoreId = nextUrl.pathname.split('/').pop()

                // Check if the store admin is accessing their assigned store
                if (urlStoreId === store_id?.toString()) {
                    return NextResponse.next()
                } else {
                    // Redirect to the correct store dashboard if not matching
                    return NextResponse.redirect(new URL(`/dashboard/stores/${store_id}`, nextUrl))
                }
            } else if (nextUrl.pathname === '/dashboard') {
                // Redirect store admins to their specific store dashboard from the main dashboard
                return NextResponse.redirect(new URL(`/dashboard/stores/${store_id}`, nextUrl))
            } else {
                // For other dashboard routes, redirect to their store dashboard
                return NextResponse.redirect(new URL(`/dashboard/stores/${store_id}`, nextUrl))
            }
        } else {
            // For other roles, redirect to home page
            return NextResponse.redirect(new URL('/', nextUrl))
        }
    }

    // Allow access to other routes
    return NextResponse.next()
})