"use client";

import Link from "next/link";
import Image from "next/image";
import useProductDisplay from "@/hooks/product-display/useProductDisplay";
import {
    ProductDisplayResponse,
    ProductDisplayType,
} from "@/types/product-list/type";
import {useEffect} from "react";
import ProductCard from "@/components/productDisplay/ProductCard";
import {useLocationContext} from "@/hooks/context/LocationProvider";

const ProductDisplay = () => {
    const {selectedStoreId} = useLocationContext();

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useProductDisplay(selectedStoreId as string);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!data?.pages || data.pages.length === 0) {
        return <div>No data available.</div>;
    }


    return (
        <div className="container mx-auto md:px-32 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                {data?.pages.flatMap((page) =>
                    page.content.map((product) => (
                        <ProductCard key={product.id} product={product}/>
                    ))
                )}
            </div>
            {hasNextPage && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out disabled:bg-blue-300"
                    >
                        {isFetchingNextPage ? "Loading more..." : "Load More"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductDisplay;
