import { FormVoucherData } from "@/types/voucher/type";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import productAPI from "@/api/product/productAPI";

interface Props {
  title: string;
  voucher: FormVoucherData | undefined;
  onSubmit: (data: FormVoucherData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FormAddVoucher: React.FC<Props> = ({
  title,
  voucher,
  onSubmit,
  onClose,
  isOpen,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormVoucherData>({
    defaultValues: voucher || {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  });
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProductList();
        setProducts(response);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (voucher) {
      Object.entries(voucher).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "startDate" || key === "endDate") {
            const localDate = new Date(value as string)
              .toISOString()
              .split("T")[0];
            setValue(key as keyof FormVoucherData, localDate);
          } else {
            setValue(key as keyof FormVoucherData, value as any);
          }
        }
      });
    } else {
      reset();
    }
  }, [voucher, setValue, reset]);

  const handleFormSubmit = (data: FormVoucherData) => {
    const formattedData = {
      ...data,
      startDate: `${data.startDate}T00:00:00Z`,
      endDate: `${data.endDate}T23:59:59Z`,
    };
    onSubmit(formattedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {voucher ? "Edit Voucher" : "Add New Voucher"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Voucher Code</Label>
            <Input
              id="code"
              {...register("code", { required: "Voucher code is required" })}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productId">Product (Optional)</Label>
            <Select
              onValueChange={(value) =>
                setValue("productId", parseInt(value, 10))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voucherType">Voucher Type</Label>
            <Controller
              name="voucherType"
              control={control}
              rules={{ required: "Voucher type is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voucher type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT_SPECIFIC">
                      Product Specific
                    </SelectItem>
                    <SelectItem value="CART_TOTAL">Cart Total</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.voucherType && (
              <p className="text-sm text-red-500">
                {errors.voucherType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Controller
              name="discountType"
              control={control}
              rules={{ required: "Discount type is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.discountType && (
              <p className="text-sm text-red-500">
                {errors.discountType.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discountValue">Discount Value</Label>
            <Input
              id="discountValue"
              type="number"
              {...register("discountValue", {
                required: "Discount value is required",
                min: 0,
              })}
              className={errors.discountValue ? "border-red-500" : ""}
            />
            {errors.discountValue && (
              <p className="text-sm text-red-500">
                {errors.discountValue.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="minPurchase">Minimum Purchase</Label>
            <Input
              id="minPurchase"
              type="number"
              {...register("minPurchase", {
                required: "Minimum purchase is required",
                min: 0,
              })}
              className={errors.minPurchase ? "border-red-500" : ""}
            />
            {errors.minPurchase && (
              <p className="text-sm text-red-500">
                {errors.minPurchase.message}
              </p>
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
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
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
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          <Button type="submit">
            {voucher ? "Update Voucher" : "Add Voucher"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAddVoucher;
