"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProps> = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
