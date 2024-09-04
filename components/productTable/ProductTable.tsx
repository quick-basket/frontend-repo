"use client";

import useProductList from "@/hooks/product-list/useProductList";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";

const ProductTable = () => {
  const { data: products, isLoading, error } = useProductList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Store
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        products && <DataTable columns={columns} data={products} />
      )}
    </div>
  );
};

export default ProductTable;
