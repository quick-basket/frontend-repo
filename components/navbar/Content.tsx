import React from 'react';
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";

interface DrawerContentProps {
    onClose: () => void;
}

const Content: React.FC<DrawerContentProps> = ({ onClose }) => {
    return (
        <div className="h-full flex flex-col p-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="self-end mb-4">
                <X size={24}/>
            </Button>
            <div className="space-y-4">
                <Button className="w-full">Sign Up</Button>
                <Button variant="outline" className="w-full">Login</Button>
                <Button variant="ghost" className="w-full justify-start">Settings</Button>
                <Button variant="ghost" className="w-full justify-start">Help</Button>
                <Button variant="ghost" className="w-full justify-start">About</Button>
            </div>
        </div>
    );
};

export default Content;