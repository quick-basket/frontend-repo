import React from 'react';
import {ChartNoAxesColumn} from "lucide-react";

const SalesCard = () => {
    return (
        <div className="p-6 rounded-md bg-white shadow">
            <div className="flex justify-between">
                <div className="">
                    <ChartNoAxesColumn/>
                </div>
                <div className="grid gap-2">
                    <h1>Total Sales</h1>
                    <h1 className="font-semibold">Rp.50.000.000</h1>
                </div>
            </div>
        </div>
    );
};

export default SalesCard;