import ProductDisplay from "@/components/productDisplay/page";
import CarouselImage from "@/components/carousel/page";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function Home() {
    return (
        <div>
            <Navbar/>
            <CarouselImage/>
            <ProductDisplay/>
            <Footer/>
        </div>
    );
}
