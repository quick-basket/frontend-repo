import React from "react";
import Image from "next/image";
import { ProductDetail } from "@/types/product-list/type";
import { formatToIDR } from "@/utils/currency";

interface ProductDetailProps {
  product: ProductDetail;
}

const ProductDetails: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedQuantity, setSelectedQuantity] = React.useState(1);
  const [mainImage, setMainImage] = React.useState("");

  React.useEffect(() => {
    if (product) {
      setMainImage(product.imageUrls[0]);
    }
  }, [product]);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {" "}
      {/* Added padding bottom for mobile */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left column: Images */}
        <div className="md:w-1/3">
          <div className="mb-4">
            <Image
              src={mainImage}
              alt={product.name}
              width={400}
              height={400}
              objectFit="contain"
              className="rounded-lg w-full"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.imageUrls.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.name} - Image ${index + 1}`}
                width={80}
                height={80}
                objectFit="cover"
                className={`rounded cursor-pointer ${
                  mainImage === img ? "border-2 border-red-600" : ""
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Middle column: Product details */}
        <div className="md:w-1/3 flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="mb-2">
            <span className="text-sm text-gray-500">Brand: </span>
            <span className="text-sm font-semibold text-blue-600">brand</span>
          </div>
          <p className="text-xl font-bold text-red-600 mb-4">
            {formatToIDR(product.discount.discountPrice)}
          </p>
          <div className="mb-4 py-4 border-y border-gray-200">
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold mb-2">Stok dari Toko</p>
            <p className="text-sm">Pengiriman dilakukan pada hari yang sama.</p>
          </div>
        </div>

        {/* Right column: Purchase options (visible only on desktop) */}
        <div className="hidden md:block md:w-1/3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="mb-4">
              <p className="font-semibold mb-2">Pengiriman</p>
              <p className="text-sm">Dikirim oleh SAPA Instant Delivery</p>
              <p className="text-sm text-green-600">Biaya Pengiriman Gratis</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Stok tersedia: {product.quantity}
              </p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Jumlah Pembelian</span>
              <div className="flex items-center gap-2">
                <button
                  className="bg-gray-200 px-3 py-1 rounded"
                  onClick={() =>
                    setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                  }
                >
                  -
                </button>
                <span>{selectedQuantity}</span>
                <button
                  className="bg-gray-200 px-3 py-1 rounded"
                  onClick={() =>
                    setSelectedQuantity(
                      Math.min(product.quantity, selectedQuantity + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
            <button className="w-full bg-red-600 text-white px-4 py-2 rounded text-lg hover:bg-red-700 transition duration-300 ease-in-out">
              + Keranjang
            </button>
          </div>
        </div>
      </div>
      {/* Sticky footer for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Jumlah Pembelian</span>
          <div className="flex items-center gap-2">
            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() =>
                setSelectedQuantity(Math.max(1, selectedQuantity - 1))
              }
            >
              -
            </button>
            <span>{selectedQuantity}</span>
            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() =>
                setSelectedQuantity(
                  Math.min(product.quantity, selectedQuantity + 1)
                )
              }
            >
              +
            </button>
          </div>
        </div>
        <button className="w-full bg-red-600 text-white px-4 py-2 rounded text-lg hover:bg-red-700 transition duration-300 ease-in-out">
          + Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
