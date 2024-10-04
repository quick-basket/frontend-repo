"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarDashboard from "../../../components/NavbarDashboard";
import DiscountTable from "@/components/discountTable/DiscountTable";
import ORderTable from "@/components/order/OrderTable";

const Orders = () => {
  const params = useParams();
  const storeId = params.storeId as any;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        storeId={storeId}
      />claude
      <div className="flex flex-col flex-grow">
        <NavbarDashboard onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-grow overflow-auto p-4">
          <ORderTable storeId={storeId} />
        </div>
      </div>
    </div>
  );
};

export default Orders;
