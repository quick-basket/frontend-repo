import React, { useEffect, useState } from "react";
import { ChartNoAxesColumn } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface SaleCartProps {
  fetchTotalAmount: (categoryId: string) => Promise<number>;
  fetchCategories: () => Promise<Category[]>;
  title: string;
}

const SalesCards: React.FC<SaleCartProps> = ({
  fetchTotalAmount,
  fetchCategories,
  title,
}) => {
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCateg = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response);
        if (response.length > 0) {
          setCategoryId(response[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    };

    fetchCateg();
  }, [fetchCategories]);

  useEffect(() => {
    const fetchSales = async () => {
      if (categoryId) {
        try {
          setTotalSales(null);
          const total = await fetchTotalAmount(categoryId);
          setTotalSales(total);
        } catch (err) {
          console.error("Failed to fetch total amount", err);
          setError("Failed to fetch total amount");
        }
      }
    };
    fetchSales();
  }, [fetchTotalAmount, categoryId]);

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
  };

  return (
    <div className="p-4 sm:p-6 rounded-md bg-white shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            <ChartNoAxesColumn size={24} />
          </div>
          <h2 className="text-sm text-gray-600">{title}</h2>
        </div>
        <div className="w-full">
          <Select
            onValueChange={handleCategoryChange}
            value={categoryId || undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-center">
          {error ? (
            <p className="text-red-500 text-sm">Error: {error}</p>
          ) : totalSales === null ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <h1 className="font-semibold text-base sm:text-lg md:text-xl">
              Rp.{totalSales.toLocaleString()}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesCards;
