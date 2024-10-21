"use client";

import useProductDisplay from "@/hooks/product-display/useProductDisplay";
import ProductCard from "@/components/productDisplay/ProductCard";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import Spinner from "../spinner/Spinner";
import {useState} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {useQuery} from "@tanstack/react-query";
import categoryAPI from "@/api/category/categoryAPI";
import {X} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

interface Category {
    id: string;
    name: string;
}

const ProductDisplay = () => {
    const {selectedStoreId} = useLocationContext();
    const [searchInput, setSearchInput] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const router = useRouter();
    const [searchParams, setSearchParams] = useState({
        name: "",
        categoryName: "",
    });

    const {data: categories, isLoading: categogiesLoading} = useQuery<
        Category[],
        Error
    >({
        queryKey: ["categories"],
        queryFn: () => categoryAPI.getCategory(),
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

    const handleSearch = () => {
        setSearchParams({
            name: searchInput,
            categoryName: selectedCategory,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const [name, categoryName] = searchInput.split(",").map((s) => s.trim());
            setSearchParams({name, categoryName});
        }
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setSearchParams((prev) => ({
            ...prev,
            categoryName: value,
        }));
    };

    const handleCancelSearch = () => {
        setSearchParams({
            name: "",
            categoryName: ""
        })
        setSelectedCategory("")
        setSearchInput("")
    }

    if (isLoading) return <Spinner fullScreen={true} size="large"/>;
    if (error) return <div>Error: {error.message}</div>;

    if (!data?.pages || data.pages.length === 0) {
        return <div>No data available.</div>;
    }

    return (
        <div className="container mx-auto md:px-32 py-8">
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                    <input
                        type="text"
                        placeholder="Search Product..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="w-full sm:w-40">
                    <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select category"/>
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant={"ghost"} className="cursor-pointer" onClick={handleCancelSearch}>
                    <X/>
                </Button>
            </div>

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
};

export default ProductDisplay;
