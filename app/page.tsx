"use client"

import Image from "next/image";
import {useSession} from "next-auth/react";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
    return (
    <>
        <Navbar/>
    </>
  );
}
