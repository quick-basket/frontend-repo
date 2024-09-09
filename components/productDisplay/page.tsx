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

const ProductDisplay = () => {
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useProductDisplay();

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

//   return (
//     <div className="container mx-auto px-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12">
//         {data.pages
//           .flatMap((page) => page.content)
//           .map((product: ProductDisplayType) => (
//             <Link href={`/product-detail/${product.id}`} key={product.id}>
//               <div className="bg-white rounded-lg shadow-lg shadow-slate-200 overflow-hidden cursor-pointer transition duration-200 ease-in-out transform hover:scale-105">
//                 <div className="relative h-48">
//                   {product.imageUrls.length > 0 ? (
//                     <Image
//                       src={product.imageUrls[0]}
//                       alt={product.name}
//                       layout="fill"
//                       objectFit="cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                       No Image
//                     </div>
//                   )}
//                   {product.discount && (
//                     <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 m-2 rounded">
//                       {product.discount.discountValue.toFixed(0)}% OFF
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold mb-2 truncate">
//                     {product.name}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-2 truncate">
//                     {product.description}
//                   </p>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       {product.discount ? (
//                         <>
//                           <span className="text-gray-400 line-through text-sm mr-2">
//                             Rp {product.price.toLocaleString()}
//                           </span>
//                           <span className="text-red-600 font-bold">
//                             Rp {product.discount.discountPrice.toLocaleString()}
//                           </span>
//                         </>
//                       ) : (
//                         <span className="text-red-600 font-bold">
//                           Rp {product.price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>
//                     <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">
//                       Beli
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//       </div>
//       {hasNextPage && (
//         <div className="flex justify-center">
//           <button
//             onClick={() => fetchNextPage()}
//             disabled={isFetchingNextPage}
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             {isFetchingNextPage ? "Loading more..." : "Load More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

    export default ProductDisplay;
