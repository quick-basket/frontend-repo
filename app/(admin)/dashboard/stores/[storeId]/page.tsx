"use client";

import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import NavbarDashboard from "../../components/NavbarDashboard";
import StoreProductTable from "@/components/storeProductTable/StoreProductTable";
import { useParams } from "next/navigation";

const Stores = () => {
  const params = useParams();
  const storeId = params.storeId as any;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-grow">
        <NavbarDashboard onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-grow overflow-auto p-4">
          <StoreProductTable storeId={storeId} />
        </div>
      </div>
    </div>
  );
};

export default Stores;
