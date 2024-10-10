import Credentials from "next-auth/providers/credentials";
import NextAuth, {Account, Profile, Session, User} from "next-auth";
import {jwtDecode} from "jwt-decode";
import GoogleProvider from "next-auth/providers/google"
import AuthAPI from "@/api/auth/authAPI";
import {JWT} from "@auth/core/jwt";

interface JWTPayload {
    iss: string;
    sub: string;
    exp: number;
    iat: number;
    scope: string;
    userId: string;
    store_id?: string; // Optional, only present for store_admin role
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
                // decode
                const decoded = jwtDecode<JWTPayload>(user.token);
                return {
                    id: decoded.userId,
                    email: decoded.sub,
                    role: decoded.scope,
                    token: user.token,
                    store_id: decoded.store_id,
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

                    const decoded = jwtDecode<JWTPayload>(user.token);
                    user.id = decoded.userId;
                    user.role = decoded.scope;
                    user.store_id = decoded.store_id;

                } catch (error) {
                    console.error('Error during sign-in process:', error);
                    return false;
                }
            }
            return true; // Proceed with sign-in
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                token.store_id = user.store_id;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    role: token.role as string,
                    store_id: token.store_id as string | undefined,
                },
                accessToken: token.accessToken as string,
            };
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 3600 * 12
    },
    secret: process.env.NEXTAUTH_SECRET,
});