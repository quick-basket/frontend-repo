import React, { useEffect, useState } from "react";
import { ChartNoAxesColumn } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definisi tipe untuk Item
interface Item {
  id: string;
  name?: string; // Nama item untuk sales
  productName?: string; // Nama produk untuk journal
}

// Definisi tipe untuk props komponen SalesCards
interface DataCardProps {
  fetchAmount: (itemId: string) => Promise<number>;
  fetchItems: () => Promise<Item[]>;
  title: string;
  itemNameKey?: keyof Item; // Kunci nama item untuk menyesuaikan respons
  icon?: React.ReactNode;
  formatValue?: (value: number) => string;
  useCurrencyFormat?: boolean;
}

// Komponen SalesCards
const SalesCards: React.FC<DataCardProps> = ({
  fetchAmount,
  fetchItems,
  title,
  itemNameKey = "name", // Default ke "name" jika tidak ada prop itemNameKey
  icon = <ChartNoAxesColumn size={24} className="text-gray-600" />,
  formatValue = (value) => `Rp.${value.toLocaleString()}`,
  useCurrencyFormat = true,
}) => {
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItemsList = async () => {
      try {
        const response = await fetchItems();
        setItems(response);
        if (response.length > 0) {
          setSelectedItemId(response[0].id);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items");
      }
    };
    fetchItemsList();
  }, [fetchItems]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedItemId) {
        try {
          setTotalAmount(null);
          const total = await fetchAmount(selectedItemId);
          setTotalAmount(total);
        } catch (err) {
          console.error("Failed to fetch amount", err);
          setError("Failed to fetch amount");
        }
      }
    };
    fetchData();
  }, [fetchAmount, selectedItemId]);

  const handleItemChange = (value: string) => {
    setSelectedItemId(value);
  };

  return (
    <div className="p-4 sm:p-6 rounded-md bg-white shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-sm text-gray-600 flex-grow">{title}</h2>
          <Select
            onValueChange={handleItemChange}
            value={selectedItemId || undefined}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {/* Ambil nama item berdasarkan prop itemNameKey */}
                  {item[itemNameKey]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-center">
          {error ? (
            <p className="text-red-500 text-sm">Error: {error}</p>
          ) : totalAmount === null ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <h1 className="font-semibold text-base sm:text-lg md:text-xl">
              {useCurrencyFormat ? formatValue(totalAmount) : totalAmount}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesCards;
