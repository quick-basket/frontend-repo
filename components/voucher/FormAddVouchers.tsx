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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

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
    defaultValues: voucher,
  });
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProductList();
        console.log("result", response);
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
          setValue(key as keyof FormVoucherData, value as any);
        }
        console.log("value", key, value);
      });
      console.log("voucher results", voucher);
    } else {
      reset();
    }
  }, [voucher, setValue, reset]);

  const handleFormSubmit = (data: FormVoucherData) => {
    console.log("data 1", data);

    onSubmit(data);
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
            <Controller
              name="startDate"
              control={control}
              rules={{ required: "Start Date is required" }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {field.value
                        ? format(new Date(field.value), "PPP")
                        : "Pick a date"}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: "End Date is required" }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {field.value
                        ? format(new Date(field.value), "PPP")
                        : "Pick a date"}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
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
