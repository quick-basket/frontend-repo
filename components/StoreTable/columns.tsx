import {ColumnDef} from "@tanstack/react-table";
import {FormDataStore, StoreType} from "@/types/store/type";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, Edit, Trash} from "lucide-react";

export const columns = (
    onEdit: (store: StoreType) => void,
    onDelete: (id: string) => void,
): ColumnDef<StoreType>[] => [
    {
        accessorKey: "name",
        header: "Store Name"
    },
    {
        accessorKey: "city",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    City
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    CreatedAt
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({ row }) => {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false, // 24-hour time format
                timeZone: 'Asia/Bangkok' // GMT+7
            }).format(new Date(row.original.createdAt));
        }
    },
    {
        accessorKey: "updatedAt",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Updated
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({ row }) => {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false, // 24-hour time format
                timeZone: 'Asia/Bangkok' // GMT+7
            }).format(new Date(row.original.updatedAt));
        }
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
        }
    }
]