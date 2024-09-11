import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {ChevronDown, MapPin} from "lucide-react";
import {Button} from "@/components/ui/button";
import useUserAddress from "@/hooks/users/useUserAddress";
import {UserAddressType} from "@/types/user/type";

const AddressDialog = () => {
    const {data: addresses, isLoading, error} = useUserAddress();
    console.log("address", addresses);
    return (
        <Dialog>
            <DialogTrigger>
                <ChevronDown />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Mau di kirim kemana?</DialogTitle>
                    <DialogDescription>
                        Pilih alamat yang paling pas buatmu, agar belanja di Alfagift lebih mudah.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {addresses?.map((address: UserAddressType) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{address.address.split(',')[0]}</span>
                                        {address.isPrimary && (
                                            <span className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full">
                        Alamat Utama
                      </span>
                                        )}
                                    </div>
                                    <span className="text-sm">{address.city}</span>
                                    <span className="text-sm text-gray-500">{address.postalCode}</span>
                                </div>
                                {address.isPrimary ? (
                                    <MapPin className="text-green-500" />
                                ) : (
                                    <Button variant="outline" size="sm">
                                        Pilih
                                    </Button>
                                )}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <span>Lokasi Sudah Ditandai</span>
                                {!address.isPrimary && (
                                    <span className="ml-2 text-blue-500 cursor-pointer">
                    Jadikan Alamat Utama
                  </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <h3 className="font-semibold">Mau pakai alamat lain?</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Tidak ada lokasi yang pas buatmu? Silahkan buat alamat baru.
                    </p>
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                        Tambah Alamat
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddressDialog;