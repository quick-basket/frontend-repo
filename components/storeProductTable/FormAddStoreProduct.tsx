import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import productAPI from "@/api/product/productAPI";
import { FormStoreProduct, StoreProduct } from "@/types/store-product/type";

interface Props {
  title: string;
  product?: StoreProduct;
  onSubmit: (data: FormStoreProduct) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FormAddStoreProduct: React.FC<Props> = ({
  title,
  product,
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
  } = useForm<FormStoreProduct>({ defaultValues: product || {} });

  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [quantityMode, setQuantityMode] = useState<"in" | "out">("in");
  const [currentQuantity, setCurrentQuantity] = useState(
    product?.quantity || 0
  );
  const [quantityChange, setQuantityChange] = useState(0);
  const param = useParams<{ storeId: string }>();
  const storeId = param.storeId;

  const isEditMode = !!product;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productAPI.getProductList();
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (product) {
      Object.entries(product).forEach(([key, value]) => {
        if (value !== null) {
          setValue(key as keyof FormStoreProduct, value as any);
        }
      });
      setCurrentQuantity(product.quantity || 0);
    } else {
      reset();
      setCurrentQuantity(0);
    }
    setQuantityChange(0);
    setQuantityMode("in");
  }, [product, setValue, reset]);

  const handleFormSubmit = (data: FormStoreProduct) => {
    const quantityDifference =
      quantityMode === "in" ? quantityChange : -quantityChange;
    onSubmit({
      ...data,
      quantity: quantityDifference,
      storeId,
    });
    onClose();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setQuantityChange(value);
  };

  const calculateNewQuantity = () => {
    return quantityMode === "in"
      ? currentQuantity + quantityChange
      : Math.max(0, currentQuantity - quantityChange);
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
              <Input value={product.productName} disabled />
            ) : (
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
            )}
            {errors.productId && (
              <p className="text-red-500">{errors.productId.message}</p>
            )}
          </div>

          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentQuantity">Current Quantity</Label>
                <Input
                  id="currentQuantity"
                  type="number"
                  value={currentQuantity}
                  disabled
                />
              </div>

              <RadioGroup
                defaultValue={quantityMode}
                onValueChange={(value) => {
                  setQuantityMode(value as "in" | "out");
                  setQuantityChange(0);
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in" id="in" />
                  <Label htmlFor="in">In</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="out" id="out" />
                  <Label htmlFor="out">Out</Label>
                </div>
              </RadioGroup>

              <div>
                <Label htmlFor="quantityChange">Quantity Change</Label>
                <Input
                  id="quantityChange"
                  type="number"
                  min="0"
                  max={quantityMode === "out" ? currentQuantity : undefined}
                  value={quantityChange}
                  onChange={handleQuantityChange}
                  required
                />
              </div>

              <div>
                <Label>New Quantity</Label>
                <Input type="number" value={calculateNewQuantity()} disabled />
              </div>
            </CardContent>
          </Card>

          <Button type="submit">{product ? "Update" : "Add"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAddStoreProduct;
