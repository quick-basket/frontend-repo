import {DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import useUpdateProfile from "@/hooks/users/useUpdateProfile";
import {swalAlert} from "@/utils/alert/swalAlert";

const EditProfileDialog = () => {
    const [name, setName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")

    const {editProfileData} = useUpdateProfile();

    const handleSaveChanges = () => {
        editProfileData({name, phone}, {
            onSuccess: () => {
                swalAlert({
                    title: "Success",
                    icon: "success",
                    text: "User Updated",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(r => {
                })
            }
        })
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you&#39;re done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)}
                           className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Phone
                    </Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                           className="col-span-3"/>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleSaveChanges}>Save changes</Button>
            </DialogFooter>
        </>
    );
};

export default EditProfileDialog;