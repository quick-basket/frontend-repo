import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {type CarouselApi} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";

export default function CarouselImage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>()

    useEffect(() => {
        fetch('/api/banner')
            .then(res => res.json())
            .then((data: Banner[]) => setBanners(data));
    }, []);

    useEffect(() => {
        if (!api) {
            return
        }

        api.on("select", () => {
            setCurrentIndex(api.selectedScrollSnap())
        })
    }, [api])


    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-32 relative pt-4">
            <Carousel
                className="w-full"
                setApi={setApi}
                plugins={[
                    // @ts-ignore
                    Autoplay({
                        delay: 2000,
                    }),
                ]}
            >
                <CarouselContent>
                    {banners.map((item) => (
                        <CarouselItem key={item.id} className="sm:basis-full md:basis-1/2">
                            <Link href={item.link}>
                                <div className="relative w-full pb-[56.25%]">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{objectFit: "cover"}}
                                        className="rounded-lg"
                                    />
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="flex justify-center mt-4">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={`mx-1 h-2 w-2 rounded-full ${index === currentIndex ? 'bg-black' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}