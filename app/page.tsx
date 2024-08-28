"use client"

import Image from "next/image";
import {useSession} from "next-auth/react";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
    const { data: session } = useSession()

    if (session) {
        console.log(session) // This will log the user's role
    }

    return (
    <>
        <Navbar/>
    </>
  );
}
