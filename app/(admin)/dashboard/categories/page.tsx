"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarDashboard from "../components/NavbarDashboard";
import CategoryTable from "@/components/category/CategoryTable";

const Categories = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-grow">
        <NavbarDashboard onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-grow overflow-auto p-4">
          <CategoryTable />
        </div>
      </div>
    </div>
  );
};

export default Categories;
