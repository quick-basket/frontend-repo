import React, { useEffect, useState } from "react";
import { ChartNoAxesColumn } from "lucide-react";

interface SaleCartProps {
  fetchTotalAmount: () => Promise<number>;
  title: string;
}
const SalesCard: React.FC<SaleCartProps> = ({ fetchTotalAmount, title }) => {
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const total = await fetchTotalAmount();
        setTotalSales(total);
      } catch (err) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchSales();
  }, [fetchTotalAmount]);

  return (
    <div className="p-4 sm:p-6 rounded-md bg-white shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-gray-600">
          <ChartNoAxesColumn size={24} />
        </div>
        <div className="text-center sm:text-right">
          <h2 className="text-sm text-gray-600 mb-2">{title}</h2>
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

export default SalesCard;
