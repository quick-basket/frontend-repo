import { ProductListType } from "@/types/product-list/type";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { CategoryType } from "@/types/category/type";

export const columns = (
  onEdit: (categoryList: CategoryType) => void,
  onDelete: (id: string) => void
): ColumnDef<CategoryType>[] => [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.original.id)}
          >
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      );
    },
  },
];
