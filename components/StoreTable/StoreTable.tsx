import React, {useState} from 'react';
import {DataTable} from "@/components/ui/DataTable";
import {columns} from "@/components/StoreTable/columns";
import useStore from "@/hooks/stores/useStore";
import Spinner from "@/components/spinner/Spinner";
import FormAddStore from "@/components/StoreTable/FormAddStore";
import {FormDataStore, StoreType} from "@/types/store/type";
import {swalAlert} from "@/utils/alert/swalAlert";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

const StoreTable = () => {
    const {
        data: stores,
        isLoading,
        error,
        editStore,
        createStore,
        deleteStore
    } = useStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<FormDataStore | undefined>(undefined)

    const handleEdit = (store: StoreType) => {
        const {id, createdAt, updatedAt, ...formDataStore} = store;
        setSelectedStore({...formDataStore, id} as FormDataStore);
        setIsDialogOpen(true);
    }

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this store?")) {
            deleteStore({id}, {
                onSuccess: () => {
                    swalAlert({
                        title: "Success",
                        icon: "success",
                        text: "Store Deleted",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                    })
                }
            });
        }
    };

    const handleDialogClose = () => {
        setSelectedStore(undefined);
        setIsDialogOpen(false);
    };

    const handleFormSubmit = (data: FormDataStore) => {
        if (selectedStore) {
            // Editing logic
            editStore({storeData: data, id: selectedStore.id}, {
                onSuccess: () => {
                    swalAlert({
                        title: "Success",
                        icon: "success",
                        text: "Store Updated",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                    })
                    handleDialogClose();
                }
            });
        } else {
            // Create new store logic
            createStore(data, {
                onSuccess: () => {
                    swalAlert({
                        title: "Success",
                        icon: "success",
                        text: "Store Added",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                    })
                    handleDialogClose();
                }
            });
        }
    }
    // console.log("Data stores", stores);

    return (
        <div className="container mx-auto pb-10 pt-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Stores</h1>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4"/> Add New Store
                </Button>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                stores && <DataTable columns={columns(handleEdit, handleDelete)} data={stores}/>
            )}

            <FormAddStore
                title={selectedStore ? "Edit Store" : "Add Store"}
                store={selectedStore}
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleFormSubmit}
            />
        </div>
    );

}

export default StoreTable;