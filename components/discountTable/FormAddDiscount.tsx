import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDiscountData } from "@/types/discount/type";
import discountAPI from "@/api/discount/discountAPI";

interface Props {
  title: string;
  discount?: FormDiscountData;
  onSubmit: (data: FormDiscountData) => void;
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
}

const FormAddDiscount: React.FC<Props> = ({
  title,
  discount,
  onSubmit,
  isOpen,
  onClose,
  storeId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormDiscountData>({
    defaultValues: discount || {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  });

  const [products, setProducts] = useState<
    { id: number; productName: string }[]
  >([]);

  const isEditMode = !!discount;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await discountAPI.getStoreProductListNotInDiscount(
          storeId
        );
        setProducts(response);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, [storeId]);

  useEffect(() => {
    if (discount) {
      Object.entries(discount).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "startDate" || key === "endDate") {
            setValue(
              key as keyof FormDiscountData,
              new Date(value as string).toISOString().split("T")[0] as any
            );
          } else {
            setValue(key as keyof FormDiscountData, value as any);
          }
        }
      });
    } else {
      reset();
    }
  }, [discount, setValue, reset]);

  const handleFormSubmit = (data: FormDiscountData) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate + "T00:00:00Z").toISOString(),
      endDate: new Date(data.endDate + "T23:59:59Z").toISOString(),
    };
    onSubmit(formattedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inventoryId">Product</Label>
            {isEditMode ? (
              <Input value={discount.productName} disabled />
            ) : (
              <Select
                onValueChange={(value) =>
                  setValue("inventoryId", parseInt(value, 10))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.inventoryId && (
              <p className="text-red-500">{errors.inventoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Type is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                    <SelectItem value="BUY_ONE_GET_ONE">
                      Buy One Get One
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <Input
                  id="value"
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.value && (
              <p className="text-red-500">{errors.value.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minPurchase">Min Purchase</Label>
            <Controller
              name="minPurchase"
              control={control}
              render={({ field }) => (
                <Input
                  id="minPurchase"
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.minPurchase && (
              <p className="text-red-500">{errors.minPurchase.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDiscount">Max Discount</Label>
            <Controller
              name="maxDiscount"
              control={control}
              render={({ field }) => (
                <Input
                  id="maxDiscount"
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.maxDiscount && (
              <p className="text-red-500">{errors.maxDiscount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              {...register("startDate", { required: "Start Date is required" })}
            />
            {errors.startDate && (
              <p className="text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              {...register("endDate", { required: "End Date is required" })}
            />
            {errors.endDate && (
              <p className="text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          <Button type="submit">{isEditMode ? "Update" : "Submit"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAddDiscount;
