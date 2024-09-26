import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import storeAdminAPI from "@/api/store/storeAdminAPI";
import { FormStoreAdminData } from "@/types/store-admin/type";

interface Props {
  title: string;
  storeAdmin: FormStoreAdminData | undefined;
  onSubmit: (data: FormStoreAdminData) => void;
  isOpen: boolean;
  onClose: () => void;
  storeAdminId: string;
}

const FormAddStoreAdmin: React.FC<Props> = ({
  title,
  storeAdmin,
  onSubmit,
  onClose,
  isOpen,
  storeAdminId,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormStoreAdminData>({
    defaultValues: storeAdmin || { newRole: "store_admin" },
  });

  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [stores, setStores] = useState<{ id: number; name: string }[]>([]);

  const isEditMode = !!storeAdmin;

  useEffect(() => {
    const fetchUserNotStoreAdmin = async () => {
      try {
        const response = await storeAdminAPI.getUserNotStoreAdmin();
        setUsers(response);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    const fetchStoreNotStoreAdmin = async () => {
      try {
        const response = await storeAdminAPI.getStoreNotStoreAdmin();
        setStores(response);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }
    };
    fetchUserNotStoreAdmin();
    fetchStoreNotStoreAdmin();
  }, []);

  useEffect(() => {
    if (storeAdmin) {
      reset(storeAdmin);
    } else {
      reset({ newRole: "store_admin", userId: undefined, storeId: undefined });
    }
  }, [storeAdmin, reset, isOpen]);

  const handleFormSubmit = (data: FormStoreAdminData) => {
    onSubmit(data);
    onClose();
  };

  const watchUserId = watch("userId");
  const watchStoreId = watch("storeId");
  const watchNewRole = watch("newRole");

  const selectedStore =
    stores.find((store) => store.id === watchStoreId) ||
    (storeAdmin && { id: storeAdmin.storeId, name: storeAdmin.storeName });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User</Label>
            {isEditMode ? (
              <Input
                value={
                  storeAdmin?.userName ||
                  users.find((u) => u.id === watchUserId)?.name ||
                  ""
                }
                disabled
              />
            ) : (
              <Controller
                name="userId"
                control={control}
                rules={{ required: "User is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) =>
                      field.onChange(parseInt(value, 10))
                    }
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.userId && (
              <p className="text-red-500">{errors.userId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newRole">Role</Label>
            <Input value={watchNewRole || "store_admin"} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeId">Store</Label>
            <Controller
              name="storeId"
              control={control}
              rules={{ required: "Store is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Store">
                      {selectedStore ? selectedStore.name : "Select a Store"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.storeId && (
              <p className="text-red-500">{errors.storeId.message}</p>
            )}
          </div>

          <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAddStoreAdmin;
