"use client";

import Link from "next/link";
import Image from "next/image";
import useProductDisplay from "@/hooks/product-display/useProductDisplay";
import {
  ProductDisplayResponse,
  ProductDisplayType,
} from "@/types/product-list/type";

const ProductDisplay = () => {
  const {
    data: products,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductDisplay();

  // if (isLoading) return <div>Loading...</div>;
  console.log(isLoading);

  if (error) return <div>Error: {error.message}</div>;
  console.log("tsetasdfasdfasfdasdfoiuhasdfoiuasdfiouhasdfhiou", products);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products?.pages.map(
          (page: ProductDisplayResponse, pageIndex: number) =>
            // Iterate over the products in the page
            page.content.map((product) => (
              <Link href={`/product-detail/${product.id}`} key={product.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-200 ease-in-out transform hover:scale-105">
                  <div className="relative h-48">
                    {product.imageUrls.length > 0 ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        No Image
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 m-2 rounded">
                        {product.discount.discountValue.toFixed(0)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 truncate">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        {product.discount ? (
                          <>
                            <span className="text-gray-400 line-through text-sm mr-2">
                              Rp {product.price.toLocaleString()}
                            </span>
                            <span className="text-red-600 font-bold">
                              Rp{" "}
                              {product.discount.discountPrice.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-red-600 font-bold">
                            Rp {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">
                        Beli
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
