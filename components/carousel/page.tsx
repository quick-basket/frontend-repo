import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const carouselItems = [
  {
    id: 1,
    imageUrl: "/banner/banner 1.png",
    link: "/special-redemption",
    alt: "Special Redemption Tumbler Stanley",
  },
  {
    id: 2,
    imageUrl: "/banner/banner 2.png",
    link: "/loyalty-member",
    alt: "Loyalty Member Alfastar",
  },
];

export default function CarouselImage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-4">
      <Carousel className="w-full">
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id}>
              <Link href={item.link}>
                <div className="relative w-full pt-[56.25%]">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt}
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
