"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import useProductDetail from "@/hooks/product-detail/useProductDetail";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProductDetail(id!);
  const [selectedQuantity, setSelectedQuantity] = React.useState(1);
  const [mainImage, setMainImage] = React.useState("");

  React.useEffect(() => {
    if (product) {
      setMainImage(product.imageUrls[0]);
    }
  }, [product]);

  //   const addToCart = () => {
  //     if (!product) return;

  //     const inventoryId = {
  //       productId: product.id,
  //       storeId: 1, // Asumsikan storeId 1 untuk contoh ini, sesuaikan sesuai kebutuhan
  //     };

  //     const cartItem: CartItem = {
  //       inventoryId,
  //       quantity: selectedQuantity,
  //       price: product.price,
  //       user_id: 1, // Sesuaikan dengan user_id dari sesi pengguna saat ini
  //     };

  //     // Ambil data keranjang dari localStorage
  //     let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  //     // Periksa apakah produk sudah ada di keranjang
  //     const existingItemIndex = cart.findIndex(
  //       (item: CartItem) =>
  //         item.inventoryId.productId === cartItem.inventoryId.productId &&
  //         item.inventoryId.storeId === cartItem.inventoryId.storeId
  //     );

  //     if (existingItemIndex >= 0) {
  //       // Jika produk sudah ada di keranjang, tambahkan jumlahnya
  //       cart[existingItemIndex].quantity += cartItem.quantity;
  //     } else {
  //       // Jika produk belum ada di keranjang, tambahkan produk baru ke keranjang
  //       cart.push(cartItem);
  //     }

  //     // Simpan keranjang yang diperbarui ke localStorage
  //     localStorage.setItem("cart", JSON.stringify(cart));
  //     alert("Produk berhasil ditambahkan ke keranjang!");
  //   };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="mb-4">
            <Image
              src={mainImage}
              alt={product.name}
              width={500}
              height={500}
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.imageUrls.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.name} - Image ${index + 1}`}
                width={100}
                height={100}
                objectFit="cover"
                className={`rounded cursor-pointer ${
                  mainImage === img ? "border-2 border-red-600" : ""
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-red-600 mb-2">
            Rp {product.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Available Quantity: {product.quantity}
          </p>
          <div className="flex items-center gap-4 mb-4">
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
          <button className="w-full bg-red-600 text-white px-4 py-2 rounded text-lg hover:bg-red-700 transition duration-300 ease-in-out">
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
