import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryType, FormCategory } from "@/types/category/type";

interface Props {
  title: string;
  category?: CategoryType;
  onSubmit: (data: CategoryType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FormAddCategory: React.FC<Props> = ({
  title,
  category,
  onSubmit,
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryType>({ defaultValues: category || {} });

  useEffect(() => {
    if (category) {
      Object.entries(category).forEach(([key, value]) => {
        if (value !== null) {
          setValue(key as keyof CategoryType, value as any);
        }
      });
    } else {
      reset();
    }
  }, [category, setValue, reset]);

  const handleFormSubmit = (data: CategoryType) => {
    onSubmit(data);
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <Button type="submit">{category ? "Update" : "Add"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAddCategory;
