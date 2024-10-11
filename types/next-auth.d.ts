import NextAuth, {DefaultSession} from "next-auth"

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        role: string;
        token: string;
        store_id?: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            role: string;
            store_id?: string;
        } & DefaultSession["user"];
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        role: string;
        store_id?: string;
        accessToken: string;
    }
}
