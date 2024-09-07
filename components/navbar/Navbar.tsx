import React from 'react';
import NavbarMobile from "@/components/navbar/NavbarMobile";
import NavbarDesktop from "@/components/navbar/NavbarDesktop";

const Navbar = () => {
    return (
        <>
            <div className="md:hidden">
                <NavbarMobile/>
            </div>
            <div className="hidden md:block">
                <NavbarDesktop/>
            </div>

        </>
    );
};

export default Navbar;