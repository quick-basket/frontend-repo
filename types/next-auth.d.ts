import NextAuth, { DefaultSession } from "next-auth"
import {JWT} from "@auth/core/jwt";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        role: string;
        token: string;
    }

    interface Session {
        user: {
            image: string;
            name: string;
            id: String;
            email: string;
            scope: string;
        }
        accessToken: string;
    }

    interface JwtType extends JWT{
        id: string,
        scope: string
    }
}
