import Credentials from "next-auth/providers/credentials";
import {JWT} from "@auth/core/jwt";
import NextAuth, {Account, Profile, User, Session} from "next-auth";
import {jwtDecode} from "jwt-decode";
import GoogleProvider from "next-auth/providers/google"
import AuthAPI, {GoogleLoginBody} from "@/api/auth/authAPI";
import {cookies} from "next/headers";

interface DecodedToken {
    userId: number;
    scope: string;
    sub: string;
}


export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {label: "Email", type: "text", placeholder: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials): Promise<User | null> {
                const user = await AuthAPI.loginWithCredentials(credentials?.username as string, credentials?.password as string);

                if (!user) {
                    throw new Error("User not found.");
                }
                const useCookies = cookies();
                useCookies.set("sid", user.token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 1000,
                    path: "/"
                })
                // decode
                const decoded = jwtDecode<DecodedToken>(user.token);
                return {
                    id: decoded.userId.toString(),
                    email: decoded.sub,
                    role: decoded.scope,
                    token: user.token
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            // Fetch JWT from backend if user is already registered
            if (account?.provider === 'google' && profile?.email) {
                try {
                    const loginBody = {
                        email: profile.email,
                        name: profile?.name,
                        googleId: profile?.sub,
                        imageUrl: profile?.picture
                    }
                    const response = await AuthAPI.loginWithGoogle(loginBody)
                    user.token = response.data.token;

                    const useCookies = cookies();
                    useCookies.set("sid", user.token, {
                        httpOnly: true,
                        secure: false,
                        maxAge: 60 * 60 * 1000,
                        path: "/"
                    })

                } catch (error) {
                    console.error('Error during sign-in process:', error);
                    return false;
                }
            }

            return true; // Proceed with sign-in
        },

        async jwt({token, user, account, profile}: {
            token: JWT,
            user: User,
            profile?: Profile | undefined,
            account: Account | null
        }) {

            if (user) {
                if (account?.provider === 'google') {
                    token.accessToken = user.token
                    const decoded = jwtDecode<DecodedToken>(user.token);
                    token.id = profile?.sub
                    token.email = profile?.email
                    token.scope = decoded.scope
                } else {
                    token.accessToken = user.token
                    const decoded = jwtDecode<DecodedToken>(user.token);
                    token.id = decoded.userId
                    token.email = decoded.sub
                    token.scope = decoded.scope
                }
            }
            return token;
        },
        async session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.sub as string,
                    email: token.email as string,
                    scope: token.scope as string,
                };
            } else {
                console.log("session not transferring")
            }
            return session
        }
    },
    session: {
        maxAge: 1 * 60 * 60,
    },
});