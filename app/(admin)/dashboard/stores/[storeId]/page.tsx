"use client";

import React, { useEffect, useState } from "react";
import NavbarDashboard from "../../components/NavbarDashboard";
import StoreProductTable from "@/components/storeProductTable/StoreProductTable";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import salesAPI from "@/api/sales/salesAPI";
// import SalesCard from "./components/SalesCard";
import { store } from "next/dist/build/output/store";
import SalesCard from "../../components/SalesCard";
import SalesCards from "./components/SalesCards";

const Stores = () => {
  const params = useParams();
  const storeId = params.storeId as any;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (storeId) {
      router.refresh();
    }
  }, [storeId]);
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        storeId={storeId}
      />
      <div className="flex flex-col flex-grow">
        <NavbarDashboard onMenuClick={() => setSidebarOpen(true)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8 container">
          <SalesCard
            fetchTotalAmount={() => salesAPI.getTotalAmountWithStoreId(storeId)}
            title="Total Sales"
          />
          <SalesCards
            fetchAmount={(categoryId) =>
              salesAPI.getTotalAmountWithStoreIdAndCategoryId(
                storeId,
                categoryId
              )
            }
            fetchItems={salesAPI.getAllCategories}
            title="Total Sales"
          />
          <SalesCards
            fetchAmount={(productId) =>
              salesAPI.getTotalAmountWithStoreIdAndProductId(storeId, productId)
            }
            fetchItems={() => salesAPI.getAllProducts(storeId)}
            title="Total Sales"
          />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <StoreProductTable storeId={storeId} />
        </div>
      </div>
    </div>
  );
};

export default Stores;
