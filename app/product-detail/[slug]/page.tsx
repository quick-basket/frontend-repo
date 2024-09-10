"use client";

import React from "react";
import Image from "next/image";
import {useParams} from "next/navigation";
import useProductDetail from "@/hooks/product-detail/useProductDetail";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ProductDetails from "@/app/product-detail/[slug]/ProductDetails";

export default function ProductDetailPage() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

    const id = slug.split('-').pop();
    const {data: product, isLoading, error} = useProductDetail(id!);


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <>
            <Navbar/>
            <div className="container py-8 md:px-32">
                <ProductDetails product={product}/>
            </div>
            <Footer/>
        </>
    );
};


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
