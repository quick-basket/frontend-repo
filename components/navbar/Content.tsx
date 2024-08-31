import React from 'react';
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";
import Spinner from "@/components/spinner/Spinner";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface DrawerContentProps {
    onClose: () => void;
}

const Content: React.FC<DrawerContentProps> = ({onClose}) => {
    const {status, data: session} = useSession();

    if (status === "loading") {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    console.log("DATA SESSION", session);

    return (
        <div className="h-full flex flex-col p-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="self-end mb-4">
                <X size={24}/>
            </Button>
            <div className="flex flex-col gap-4">
                {status === "authenticated" && session?.user ? (
                    <>
                        <Link href="/profile">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar>
                                    <AvatarImage src={session.user.image || undefined}/>
                                    <AvatarFallback>{session.user.name.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{session.user.name}</p>
                                    <p className="text-sm text-gray-500">{session.user.email}</p>
                                </div>
                            </div>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start">Settings</Button>
                        <Link href="/reset-password/request">
                            <Button variant="ghost" className="w-full justify-start">Reset Password</Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start">About</Button>
                        <div className="flex-grow"/>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => signOut()}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/registration" className="w-full">
                            <Button className="w-full">Sign Up</Button>
                        </Link>
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full">Login</Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start">Settings</Button>
                        <Button variant="ghost" className="w-full justify-start">Help</Button>
                        <Button variant="ghost" className="w-full justify-start">About</Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Content;