"use client";

import useProductDisplay from "@/hooks/product-display/useProductDisplay";
import ProductCard from "@/components/productDisplay/ProductCard";
import { useLocationContext } from "@/hooks/context/LocationProvider";
import Spinner from "../spinner/Spinner";
import { useState } from "react";

const ProductDisplay = () => {
  const { selectedStoreId } = useLocationContext();

  const [searchInput, setSearchInput] = useState(""); // Single input state
  const [searchParams, setSearchParams] = useState({
    name: "",
    categoryName: "",
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductDisplay(
    selectedStoreId as string,
    searchParams.name || undefined,
    searchParams.categoryName || undefined
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const [name, categoryName] = searchInput.split(",").map((s) => s.trim());
      setSearchParams({ name, categoryName });
    }
  };

  if (isLoading) return <Spinner fullScreen={true} size="large" />;
  if (error) return <div>Error: {error.message}</div>;

  if (!data?.pages || data.pages.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div className="container mx-auto md:px-32 py-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Product..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        {data?.pages.flatMap((page) =>
          page.content.map((product) => (
            <ProductCard key={product.id} product={product} />
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
};

export default ProductDisplay;
