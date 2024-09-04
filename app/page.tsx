"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import Navbar from "@/components/navbar/Navbar";
import ProductDisplay from "@/components/productDisplay/page";
import CarouselImage from "@/components/carousel/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <CarouselImage />
      <ProductDisplay />
    </>
  );
}
