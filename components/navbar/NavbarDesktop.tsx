import React from 'react';
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {LogOut, MapPin, Search, Settings, ShoppingBasket, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {signIn, signOut, useSession} from "next-auth/react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";

const NavbarDesktop = () => {
    const {data: session, status} = useSession();

    const renderAuthSection = () => {
        if (status === "loading") {
            return <Skeleton className="h-10 w-10 rounded-full"/>;
        }

        if (session) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'}/>
                                <AvatarFallback>{session.user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4"/>
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4"/>
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span onClick={() => signOut()}>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <>
                <Link href="/registration">
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Register</Button>
                </Link>
                <Link href="/login">
                    <Button className="bg-red-600 text-white hover:bg-red-700">Log in</Button>
                </Link>
            </>
        );
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto py-2">
                <div className="flex items-center justify-between">
                    <div className="w-[120px]">
                        <Image src="/logo-transformed.webp" alt="Alfagift logo" width={120} height={40}/>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                        <MapPin size={16} className="mr-1"/>
                        <span>JABODETABEK</span>
                    </div>
                    <div className="flex-1 mx-4">
                        <div className="relative">
                            <Input
                                placeholder="Temukan produk favoritmu disini"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}/>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center">
                        <ShoppingBasket className="text-gray-600 ml-4" size={24}/>
                        <div className="flex items-center space-x-4 ml-4">
                            {renderAuthSection()}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarDesktop;