import { DiscountList } from "@/types/discount/type";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown, Edit, Trash } from "lucide-react";

export const columns = (
  onEdit: (discount: DiscountList) => void,
  onDelete: (id: string) => void
): ColumnDef<DiscountList>[] => [
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "minPurchase",
    header: "Min Purchase",
  },
  {
    accessorKey: "maxDiscount",
    header: "Max Discount",
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24-hour time format
        timeZone: "Asia/Bangkok", // GMT+7
      }).format(new Date(row.original.startDate));
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24-hour time format
        timeZone: "Asia/Bangkok", // GMT+7
      }).format(new Date(row.original.endDate));
    },
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
