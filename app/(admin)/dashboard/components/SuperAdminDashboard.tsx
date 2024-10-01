import React, { useState } from "react";
import Sidebar from "@/app/(admin)/dashboard/components/Sidebar";
import NavbarDashboard from "@/app/(admin)/dashboard/components/NavbarDashboard";
import StoreTable from "@/components/StoreTable/StoreTable";
import SalesCard from "@/app/(admin)/dashboard/components/SalesCard";
import salesAPI from "@/api/sales/salesAPI";

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-grow">
        <NavbarDashboard onMenuClick={() => setSidebarOpen(true)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8 container">
          <SalesCard
            fetchTotalAmount={salesAPI.getTotalAmountAllStore}
            title="Total Sales All Store"
          />
          <SalesCard
            fetchTotalAmount={salesAPI.getTotalAmountLastWeek}
            title="Total Sales Last Week"
          />
          <SalesCard
            fetchTotalAmount={salesAPI.getTotalAmountLastMonth}
            title="Total Sales Last Month"
          />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <StoreTable />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
