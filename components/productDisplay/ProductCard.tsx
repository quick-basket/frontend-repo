import React from "react";
import { ProductDisplayType } from "@/types/product-list/type";
import Image from "next/image";
import { formatToIDR } from "@/utils/currency";
import Link from "next/link";

interface ProductCardProps {
  product: ProductDisplayType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const encodedName = encodeURIComponent(
    product.name.toLowerCase().replace(/ /g, "-")
  );

  return (
    <Link href={`/product-detail/${encodedName}-${product.inventoryId}`}>
      <div className="bg-white rounded-lg shadow-lg shadow-slate-200 overflow-hidden cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 h-full flex flex-col">
        <div className="relative h-48">
          {product.imageUrls.length > 0 ? (
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-48 object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          )}
          {product.discount && product.discount.discountType && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 m-2 rounded">
              {product.discount.discountType === "BUY_ONE_GET_ONE"
                ? `BUY 1 GET 1`
                : `${product.discount.discountValue.toFixed(0)}% OFF`}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm mb-2">{product.name}</h3>
          <div className="mt-auto">
            <div className="flex flex-col gap-4 justify-between">
              <div>
                {product.discount.discountType !== null &&
                product.discount.discountType !== "BUY_ONE_GET_ONE" ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-gray-400 line-through text-xs mr-2">
                        {formatToIDR(product.price)}
                      </span>
                      <span className="text-red-600 font-bold">
                        {formatToIDR(product.discount.discountPrice)}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-red-600 font-bold">
                    {formatToIDR(product.price)}
                  </span>
                )}
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
