import { JournalList } from "@/types/journal/type";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<JournalList>[] => [
  {
    accessorKey: "productName",
    header: "Name",
  },
  {
    accessorKey: "quantityChange",
    header: "Quantity Change",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
