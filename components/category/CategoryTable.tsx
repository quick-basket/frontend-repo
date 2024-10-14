"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import { swalAlert } from "@/utils/alert/swalAlert";
import Spinner from "../spinner/Spinner";
import { confirmAlert, notify } from "@/utils/alert/notiflixConfig";
import useCategory from "@/hooks/cart/category/useCategory";
import FormAddCategory from "./FormAddCategory";
import { CategoryType } from "@/types/category/type";

const CategoryTable = () => {
  const {
    data: categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >(undefined);

  const handleEdit = (categories: CategoryType) => {
    const { id, ...CategoryType } = categories;
    setSelectedCategory({ ...CategoryType, id } as CategoryType);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await confirmAlert(
      "Delete Category",
      "Are ypu sure delete this Category?"
    );
    if (result) {
      try {
        await deleteCategory({ id });
        notify({
          text: "Store successfully deleted",
          type: "success",
        });
      } catch (error) {
        notify({
          text: "Failed to delete store",
          type: "error",
        });
      }
    }
  };

  const handleDialogClose = () => {
    setSelectedCategory(undefined);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = (data: CategoryType) => {
    console.log("Submitting form data:", data);

    if (selectedCategory) {
      updateCategory(
        {
          id: selectedCategory.id,
          categoryData: data,
        },
        {
          onSuccess: (updatedCategory) => {
            console.log("Category updated:", updatedCategory);

            swalAlert({
              title: "Success",
              icon: "success",
              text: "Category Updated",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              handleDialogClose();
            });
          },
          onError: (error) => {
            console.error("Error updating Category:", error);
          },
        }
      );
    } else {
      createCategory(data, {
        onSuccess: () => {
          swalAlert({
            title: "Success",
            icon: "success",
            text: "Store Added",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {});
          handleDialogClose();
        },
      });
    }
  };

  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>
      {isLoading ? (
        <Spinner fullScreen={true} size="large" />
      ) : (
        categories && (
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={categories}
          />
        )
      )}
      <FormAddCategory
        title={selectedCategory ? "Edit Category" : "Add Category"}
        category={selectedCategory}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default CategoryTable;
