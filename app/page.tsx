"use client"

import Image from "next/image";
import {useSession} from "next-auth/react";

export default function Home() {
    const { data: session } = useSession()

    if (session) {
        console.log(session) // This will log the user's role
    }

    return (
    <>
      <div className="text-3xl">HELLO HOMEPAGE</div>
    </>
  );
}
