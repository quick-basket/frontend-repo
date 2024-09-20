// import { OrderList, OrderStatusUpdate } from "@/types/order/type";
// import { Controller, useForm } from "react-hook-form";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Button } from "../ui/button";
// import { useEffect } from "react";

// interface Props {
//   title: string;
//   order?: OrderList;
//   onSubmit: (data: OrderList) => void;
//   isOpen: boolean;
//   onClose: () => void;
//   storeId: string;
// }

// const FormEditOrder: React.FC<Props> = ({
//   title,
//   order,
//   onSubmit,
//   isOpen,
//   onClose,
//   storeId,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//     setValue,
//   } = useForm<OrderStatusUpdate>({
//     defaultValues: order || {},
//   });

//   useEffect(() => {
//     if (order) {
//       Object.entries(order).forEach(([key, value]) => {
//         if (value !== null) {
//           setValue(key as keyof OrderStatusUpdate, value as any);
//         }
//         console.log("value", key, value);
//       });
//       console.log("discsount resutl", order);
//     } else {
//       reset();
//     }
//   }, [order, setValue, reset]);

//   const handleFormSubmit = (data: OrderStatusUpdate) => {
//     onSubmit(data);
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="status">Status</Label>
//             <Controller
//               rules={{ required: "Type is required" }}
//               render={({ field }) => (
//                 <Select onValueChange={field.onChange} value={field.name}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select discount type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="PERCENTAGE">Percentage</SelectItem>
//                     <SelectItem value="FIXED">Fixed</SelectItem>
//                     <SelectItem value="BUY_ONE_GET_ONE">
//                       Buy One Get One
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//             {errors.id && <p className="text-red-500">{errors.id.message}</p>}
//           </div>

//           <Button type="submit">{order ? "Update" : "Add"}</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default FormEditOrder;
