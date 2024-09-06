import React, {useState} from 'react';
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import NavbarContent from "@/components/navbar/NavbarContent";
import Content from "@/components/navbar/Content";

const Navbar = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <NavbarContent/>
            <DrawerContent className="h-full">
                <DrawerHeader>
                    <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
                <Content onClose={() => setOpen(false)}/>
            </DrawerContent>
        </Drawer>
    );
};

export default Navbar;