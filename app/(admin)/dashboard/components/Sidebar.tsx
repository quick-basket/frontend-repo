import React from 'react';
import {ShoppingBasket} from "lucide-react";

interface SidebarProps{
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-50 transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                <div className="flex flex-col min-h-screen">
                    {/* Sidebar Header */}
                    <div className="px-6 py-4 flex items-center justify-between bg-gray-900">
                        <h2 className="text-lg font-semibold">Quick Basket Admin</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✖
                        </button>
                    </div>

                    {/* Sidebar Items */}
                    <div className="flex-1 overflow-y-auto">
                        <SidebarItem icon={<span>📦</span>} text="Products" />
                        <SidebarItem icon={<span>📜</span>} text="Orders" />
                        <SidebarItem icon={<span>👥</span>} text="Customers" />
                    </div>
                </div>
            </div>
        </>
    );
};

interface SideBarItemProps {
    icon: React.ReactNode;
    text: string;
}

const SidebarItem: React.FC<SideBarItemProps> = ({ icon, text }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-600 cursor-pointer">
        {icon}
        <p>{text}</p>
    </div>
);

export default Sidebar;