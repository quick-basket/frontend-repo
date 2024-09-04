import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FormDataStore } from "@/types/store/type";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormAddProduct } from "@/types/product-list/type";

interface Props {
  title: string;
  product?: FormAddProduct;
  onSubmit: (data: FormAddProduct) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FormAddStore: React.FC<Props> = ({
  title,
  product,
  onSubmit,
  onClose,
  isOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormAddProduct>({
    defaultValues: product || {},
  });

  useEffect(() => {
    if (product) {
      // Populate form fields with product data when editing
      Object.entries(product).forEach(([key, value]) => {
        setValue(key as keyof FormAddProduct, value);
      });
    } else {
      reset();
    }
  }, [product, setValue, reset]);

  // const {createStore} = useStore();

  const handleFormSubmit = (data: FormAddProduct) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
          {["name", "description", "price", "categoryId"].map((field) => (
            <div key={field} className="grid gap-2">
              <Label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                type="text"
                placeholder={`Enter ${field}`}
                {...register(field as keyof FormAddProduct)}
                className={
                  errors[field as keyof FormAddProduct] ? "border-red-500" : ""
                }
              />
              {errors[field as keyof FormAddProduct] && (
                <p className="text-sm text-red-500">
                  {errors[field as keyof FormAddProduct]?.message}
                </p>
              )}
            </div>
          ))}
          <Button type="submit">{product ? "Update" : "Add"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAddStore;
