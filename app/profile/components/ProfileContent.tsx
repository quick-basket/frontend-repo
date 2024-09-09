import React from 'react';
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from '@/components/ui/button';
import {Camera, CheckCircle, Mail, Pencil, Phone, UserRoundX, XCircle} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Label} from '@/components/ui/label';
import {Input} from "@/components/ui/input";
import useProfileDetails from "@/hooks/users/useProfileDetails";
import EditProfileDialog from "@/app/profile/components/EditProfileDialog";
import AvatarUploadDialog from "@/app/profile/components/AvatarUploadDialog";
import VerificationStatus from "@/app/profile/components/VerificationStatus";

const ProfileContent = () => {
    const {data, isLoading, error} = useProfileDetails();

    const handleResendVerification = async () => {
        // Implement the logic to resend verification email
        console.log('Resending verification email');
    };
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">My Profile</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="hover:text-blue-600">
                            <Pencil className="h-5 w-5"/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent><EditProfileDialog/></DialogContent>
                </Dialog>
            </div>
            <div className="flex justify-center items-center">
                <div className="relative">
                    <AvatarUploadDialog
                        currentAvatar={data?.image}
                    />
                    <div className="absolute rounded-full bg-blue-500 bottom-0 right-0 p-1">
                        <Camera className="h-4 w-4 text-white"/>
                    </div>
                </div>
            </div>
            <form className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={data?.name} readOnly/>
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Input id="email" value={data?.email} readOnly/>
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                    </div>
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                        <Input id="phone" value={data?.phone} readOnly/>
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                    </div>
                </div>
                <div>
                   <VerificationStatus isVerified={data!.verified} onResendVerification={handleResendVerification}/>
                </div>
            </form>
        </div>
    );
};

export default ProfileContent;