import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import useProfileDetails from "@/hooks/users/useProfileDetails";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";

interface Props{
    onMenuClick: () => void;
}

const NavbarDashboard: React.FC<Props> = ({ onMenuClick }) => {
    const { data: profile, isLoading, error } = useProfileDetails();

    return (
        <div className="py-4 px-4 md:px-10 bg-white shadow w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        // className="md:hidden"
                        onClick={onMenuClick}
                        aria-label="Toggle menu"
                    >
                        <Menu />
                    </Button>
                    <h1 className="text-lg md:text-xl font-semibold">NAMA STORE</h1>
                </div>
                <Avatar className="hover:cursor-pointer w-8 h-8 md:w-10 md:h-10">
                    <AvatarImage src={profile?.image} alt="Avatar image" />
                    <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
};

export default NavbarDashboard;