import React from "react";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { CartItem, FormCartItem } from "@/types/cart/type";
import useCart from "@/hooks/cart/useCart";
import Image from "next/image";

interface CartItemsProps {
  items: CartItem[];
}

const CartItems: React.FC<CartItemsProps> = ({ items }) => {
  const { editCart, deleteCart, deleteAllCart } = useCart();

  const handleQuantityChange = (cartId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      const cartData: FormCartItem = {
        quantity: newQuantity,
      };
      editCart({ cartData, cartId });
    }
  };

  const handleRemoveItem = (id: string) => {
    deleteCart({ id });
  };

  const handleDeleteAll = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus semua item di keranjang?"
      )
    ) {
      deleteAllCart();
    }
  };
  return (
    <>
      <button
        className="flex items-center text-blue-600 mb-4"
        onClick={handleDeleteAll}
      >
        <Trash2 className="mr-2" size={20} />
        Hapus Semua
      </button>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Truck className="mr-2" size={20} />
          <span className="font-semibold">Stok dari Toko</span>
        </div>
        <div className="text-sm text-gray-600 mb-4">Pengiriman Hari ini</div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center mb-4 pb-4 border-b"
          >
            <Image
              src={item.imageUrls?.[0] || "/default-image-url.jpg"}
              width={100}
              height={100}
              alt={item.productName || "Product Image"}
              className="w-20 h-20 object-cover mr-4 mb-4 sm:mb-0"
            />
            <div className="flex-grow mb-4 sm:mb-0">
              <h3 className="font-semibold">{item.productName}</h3>
              <div className="flex items-center mt-2">
                {item.discountType === "PERCENTAGE" && (
                  <span className="text-orange-500 font-semibold mr-2">
                    {Math.round((1 - item.discountPrice / item.price) * 100)}%
                  </span>
                )}
                {item.discountType === "FIXED" && (
                  <span className="text-orange-500 font-semibold mr-2">
                    -Rp{" "}
                    {(item.price - item.discountPrice).toLocaleString("id-ID")}
                  </span>
                )}

                <span className="font-bold">
                  Rp {item.discountPrice.toLocaleString("id-ID")}
                </span>
              </div>
              {item.discountType === "BUY_ONE_GET_ONE" && (
                <div className="text-gray-500">Get Free 1 Item</div>
              )}
              {item.discountPrice < item.price && (
                <div className="text-gray-500 line-through">
                  Rp {item.price.toLocaleString("id-ID")}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                className="p-1 border rounded"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button
                className="p-1 border rounded"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              className="ml-4 mt-4 sm:mt-0"
              onClick={() => handleRemoveItem(item.id)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartItems;
