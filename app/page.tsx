"use client";

import ProductDisplay from "@/components/productDisplay/page";
import CarouselImage from "@/components/carousel/page";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function Home() {
    return (
        <>
            <Navbar/>
            <CarouselImage/>
            <ProductDisplay/>
            <Footer/>
        </>
    );
}
