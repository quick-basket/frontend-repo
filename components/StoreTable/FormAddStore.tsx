import React, {useEffect} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {FormDataStore} from "@/types/store/type";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

interface Props {
    title: string,
    store?: FormDataStore,
    onSubmit: (data: FormDataStore) => void;
    isOpen: boolean;
    onClose: () => void;
}

const FormAddStore: React.FC<Props> = ({title, store, onSubmit, onClose, isOpen}) => {
    const {register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue} = useForm<FormDataStore>({
        defaultValues: store || {}
    })

    useEffect(() => {
        if (store) {
            // Populate form fields with store data when editing
            Object.entries(store).forEach(([key, value]) => {
                setValue(key as keyof FormDataStore, value);
            });
        } else {
            reset();
        }
    }, [store, setValue, reset]);

    // const {createStore} = useStore();

    const handleFormSubmit = (data: FormDataStore) => {
        onSubmit(data);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    {['name', 'address', 'city', 'province', 'postalCode'].map((field) => (
                        <div key={field} className="grid gap-2">
                            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                            <Input
                                id={field}
                                type="text"
                                placeholder={`Enter ${field}`}
                                {...register(field as keyof FormDataStore)}
                                className={errors[field as keyof FormDataStore] ? "border-red-500" : ""}
                            />
                            {errors[field as keyof FormDataStore] && (
                                <p className="text-sm text-red-500">{errors[field as keyof FormDataStore]?.message}</p>
                            )}
                        </div>
                    ))}
                    <Button type="submit">
                        {store ? 'Update' : 'Add'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormAddStore;