import React, {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { UserRoundX } from 'lucide-react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import useUpdateProfile from "@/hooks/users/useUpdateProfile";
import {swalAlert} from "@/utils/alert/swalAlert";

interface Props {
    currentAvatar?: string;
}

const AvatarUploadDialog: React.FC<Props> = ({currentAvatar}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const {editProfileImage} = useUpdateProfile();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleUpload = async () => {
        console.log("button click", selectedFile)
        if (selectedFile) {
            try {
                editProfileImage({file: selectedFile, previewUrl: previewImage as string});
                await swalAlert({
                    title: "Success",
                    icon: "success",
                    text: "Change image profile success",
                    showConfirmButton: false,
                    timer: 1500
                })
            } catch (error: any) {
                await swalAlert({
                    title: "Error",
                    icon: "error",
                    text: error.message,
                    timer: 1500
                })
            }
        }
        console.log(selectedFile)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Avatar className="h-20 w-20 cursor-pointer">
                    <AvatarImage src={currentAvatar} />
                    <AvatarFallback>
                        <UserRoundX />
                    </AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={previewImage || currentAvatar} />
                            <AvatarFallback>
                                <UserRoundX />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Profile Picture</Label>
                        <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>
                <Button onClick={handleUpload} disabled={!previewImage}>
                    Upload New Avatar
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AvatarUploadDialog;