import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FormDataProduct } from "@/types/product-list/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CategoryAPI from "@/api/category/categoryAPI";
import { ScrollArea } from "../ui/scroll-area";
import { AspectRatio } from "../ui/aspect-ratio";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Props {
  title: string;
  product?: FormDataProduct;
  onSubmit: (data: FormDataProduct) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FormAddProduct: React.FC<Props> = ({
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
  } = useForm<FormDataProduct>({
    defaultValues: product || {},
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>(
    product?.imageUrls || []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await CategoryAPI.getCategory();
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      Object.entries(product).forEach(([key, value]) => {
        if (value !== null) {
          setValue(key as keyof FormDataProduct, value);
        }
      });
      setCurrentImageUrls(product.imageUrls || []);
    } else {
      reset();
      setCurrentImageUrls([]);
    }
    setImagesToDelete([]);
  }, [product, setValue, reset]);

  const handleFormSubmit = (data: FormDataProduct) => {
    if (data.imageFiles) {
      data.imageFiles = Array.from(data.imageFiles);
    }
    data.imagesToDelete = imagesToDelete;
    onSubmit(data);
    onClose();
  };

  const handleRemoveImage = (imageId: number, imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageId]);

    if (product && product.imageUrls) {
      const updatedImageUrls = currentImageUrls.filter(
        (url) => url !== imageUrl
      );
      setCurrentImageUrls(updatedImageUrls);
      setValue("imageUrls", updatedImageUrls); // Update the form state
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-200px)]">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid gap-4"
          >
            {["name", "description", "price"].map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  type={field === "price" ? "number" : "text"}
                  placeholder={`Enter ${field}`}
                  {...register(field as keyof FormDataProduct)}
                  className={
                    errors[field as keyof FormDataProduct]
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors[field as keyof FormDataProduct] && (
                  <p className="text-sm text-red-500">
                    {errors[field as keyof FormDataProduct]?.message}
                  </p>
                )}
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                onValueChange={(value) =>
                  setValue("categoryId", parseInt(value, 10))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={product?.categoryName || "Select a category"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Images</Label>
              {currentImageUrls.length > 0 ? (
                <ScrollArea className="h-72 w-full rounded-md border">
                  <div className="flex flex-wrap gap-4 p-4">
                    {currentImageUrls.map((url) => (
                      <div key={url} className="relative w-32 h-32">
                        <AspectRatio ratio={1}>
                          <Image
                            src={url}
                            alt={`Product Image`}
                            className="object-cover"
                            layout="fill"
                          />
                        </AspectRatio>
                        <Button
                          type="button"
                          onClick={() =>
                            handleRemoveImage(
                              product?.imageIds![
                                currentImageUrls.indexOf(url)
                              ] || -1,
                              url
                            )
                          }
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-gray-500">No images uploaded</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Add/Update Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                {...register("imageFiles")}
              />
              {errors.imageFiles && (
                <p className="text-sm text-red-500">
                  {errors.imageFiles.message}
                </p>
              )}
            </div>
            <Button type="submit">{product ? "Update" : "Add"}</Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FormAddProduct;
