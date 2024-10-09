"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarDashboard from "../../../components/NavbarDashboard";
import JournalTable from "@/components/journal/JournalTable";
import SalesCards from "../components/SalesCards";
import journalAPI from "@/api/journal/journalAPI";

const Journals = () => {
  const params = useParams();
  const storeId = params.storeId as any;
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          <SalesCards
            fetchAmount={(inventoryId) =>
              journalAPI.getTotalInventoryIn(inventoryId)
            }
            fetchItems={() =>
              journalAPI.getAllInventoryJournalByStoreId(storeId)
            }
            title="Total Product In"
            itemNameKey="productName"
            useCurrencyFormat={false}
          />
          <SalesCards
            fetchAmount={(inventoryId) =>
              journalAPI.getTotalInventoryOut(inventoryId)
            }
            fetchItems={() =>
              journalAPI.getAllInventoryJournalByStoreId(storeId)
            }
            title="Total Product Out"
            itemNameKey="productName"
            useCurrencyFormat={false}
          />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <JournalTable storeId={storeId} />
        </div>
      </div>
    </div>
  );
};

export default Journals;
