"use client"

import React, {useState} from 'react';
import useProfileDetails from "@/hooks/users/useProfileDetails";
import Spinner from "@/components/spinner/Spinner";
import ProfileContent from "@/app/profile/components/ProfileContent";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import OrderList from "@/app/profile/components/OrderList";

const Profile = () => {
    const { data, isLoading, error } = useProfileDetails();
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileContent />;
            case 'orders':
                return <OrderList/>
            case 'vouchers':
                return <div>Voucher list goes here</div>;
            default:
                return null;
        }
    };

    if (isLoading) return <Spinner />;
    if (error) return <div>Error: {error.message}</div>;

    const menuItems = [
        { id: 'profile', label: 'Profile' },
        { id: 'orders', label: 'Order Transactions' },
        { id: 'vouchers', label: 'Vouchers' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container py-8 px-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile menu */}
                    <div className="lg:hidden">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="menu">
                                <AccordionTrigger className="bg-white shadow rounded-t-lg px-4 py-2">
                                    Menu
                                </AccordionTrigger>
                                <AccordionContent className="bg-white shadow rounded-b-lg">
                                    <ul className="space-y-2 p-4">
                                        {menuItems.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => setActiveTab(item.id)}
                                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                                                        activeTab === item.id
                                                            ? 'bg-blue-500 text-white'
                                                            : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden lg:block lg:w-1/4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Menu</h2>
                            <ul className="space-y-2">
                                {menuItems.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                                                activeTab === item.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </h2>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;