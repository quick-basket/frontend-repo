import React, {useState} from 'react';
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import NavbarContent from "@/components/navbar/NavbarContent";
import Content from "@/components/navbar/Content";

const Navbar = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <NavbarContent />
            <DrawerContent className="h-full">
                < Content onClose={() => setOpen(false)} />
            </DrawerContent>
        </Drawer>
    );
};

export default Navbar;