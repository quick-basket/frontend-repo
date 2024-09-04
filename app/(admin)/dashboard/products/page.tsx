"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarDashboard from "../components/NavbarDashboard";
import StoreTable from "@/components/StoreTable/StoreTable";
import ProductTable from "@/components/productTable/ProductTable";

const Products = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-grow">
        <NavbarDashboard onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-grow overflow-auto p-4">
          <ProductTable />
        </div>
      </div>
    </div>
  );
};

export default Products;
