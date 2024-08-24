import Credentials from "next-auth/providers/credentials";
import {JWT} from "@auth/core/jwt";
import NextAuth, {Account, Profile, User, Session } from "next-auth";
import {cookies} from "next/headers";
import {jwtDecode} from "jwt-decode";
import GoogleProvider from "next-auth/providers/google"

interface DecodedToken {
    userId: number;
    scope: string;
    sub: string;
}


export const {handlers, signIn, signOut, auth} = NextAuth({
    debug: true,
    providers: [
        Credentials({
            credentials: {
                username: {label: "Email", type: "text", placeholder: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials): Promise<User | null> {
                const res = await fetch("http://localhost:8080/api/v1/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials?.username,
                        password: credentials?.password,
                    }),
                });

                if (!res.ok) return null;

                const user = await res.json();
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
        async signIn({ user, account, profile, email, credentials }) {
            console.log('SIGN IN CALLBACK user', JSON.stringify(user, null, 2));
            console.log('SIGN IN CALLBACK account', JSON.stringify(account, null, 2));
            console.log('SIGN IN CALLBACK profile', JSON.stringify(profile, null, 2));
            // Fetch JWT from backend if user is already registered
            if (account?.provider === 'google' && profile?.email) {
                try {
                    // Check if the email exists in the database
                    const checkEmailResponse = await fetch(`http://localhost:8080/api/v1/auth/check-email?email=${profile.email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const emailExists = await checkEmailResponse.json();
                    console.log('EMAIL EXISTS', emailExists);

                    if (!emailExists.data) {
                        console.log('Email does not exist in the database. Redirecting to registration.');
                        // Redirect user to registration or handle accordingly
                        return '/'  // Prevent sign-in
                    }

                    // If email exists, proceed to generate the JWT
                    const response = await fetch('http://localhost:8080/api/v1/auth/generate-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: profile.email,
                            name: profile.name,
                            googleId: profile.sub,
                        }),
                    });

                    if (!response.ok) {
                        console.error('Failed to generate JWT from backend');
                    }

                    const data = await response.json();
                    user.token = data.data; // Store the JWT in the user object

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
                    token.id = profile?.sub
                    token.email = profile?.email
                } else {
                    token.accessToken = user.token
                    const decoded = JSON.parse(atob(user.token.split('.')[1]))
                    token.id = decoded.userId
                    token.email = decoded.sub
                    token.scope = decoded.scope
                }
            }
            console.log('JWT CALLBACK user', JSON.stringify(user, null, 2));
            console.log('JWT CALLBACK account', JSON.stringify(account, null, 2));
            console.log('JWT CALLBACK profile', JSON.stringify(profile, null, 2));
            return token;
        },
        async session({session, token}: { session: Session; token: JWT } )  {
            console.log('SESSION CALLBACK token', JSON.stringify(token, null, 2));
            if (token){
                session.user = {
                    ...session.user,
                    id: token.sub as string,
                    email: token.email as string,
                    scope: token.scope as string,
                };
                console.log('SESSION CALLBACK session', JSON.stringify(session, null, 2));
            } else {
                console.log("session not transferring")
            }
            return session
        }
    },
    session: {
        maxAge: 12 * 60 * 60,
    },
});