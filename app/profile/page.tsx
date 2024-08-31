"use client"

import React from 'react';
import {ArrowLeft, Camera, CheckCircle, Mail, Pencil, Phone, UserRoundX, XCircle} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import useProfileDetails from "@/hooks/users/useProfileDetails";
import Spinner from "@/components/spinner/Spinner";
import Link from "next/link";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import EditProfileDialog from "@/app/profile/components/EditProfileDialog";

const Profile = () => {
    const {data, isLoading, error} = useProfileDetails();

    console.log(data);

    if (isLoading) return <Spinner/>
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className="bg-red-600">
                <div className="flex px-4 py-6 text-white justify-between">
                    <div className="flex gap-4">
                        <Link href="/">
                            <ArrowLeft/>
                        </Link>
                        <p>My Profile</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild className="hover:cursor-pointer">
                            <Pencil/>
                        </DialogTrigger>
                        <DialogContent>
                            <EditProfileDialog/>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className=""></div>
            </div>
            <div className="p-4 grid gap-2">
                <div className="flex justify-center items-center">
                    <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={data?.image}/>
                            <AvatarFallback>
                                <UserRoundX/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute rounded-full bg-blue-500 bottom-0 right-0 p-1">
                            <Camera className="h-4 w-4 text-white"/>
                        </div>
                    </div>
                </div>
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data?.name || ''} readOnly/>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Input id="email" value={data?.email || ''} readOnly/>
                            <Mail
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                            <Input id="phone" value={data?.phone || ''} readOnly/>
                            <Phone
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                        </div>
                    </div>
                    <div>
                        <Label>Verification Status</Label>
                        <div className="flex items-center mt-1">
                            {data?.verified ? (
                                <>
                                    <CheckCircle className="text-green-500 h-5 w-5 mr-2"/>
                                    <span className="text-green-500">Verified</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="text-red-500 h-5 w-5 mr-2"/>
                                    <span className="text-red-500">Not Verified</span>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Profile;