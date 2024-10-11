"use client"

import React from 'react';
import {useSession} from "next-auth/react";
import SuperAdminDashboard from "@/app/(admin)/dashboard/components/SuperAdminDashboard";
import Spinner from "@/components/spinner/Spinner";

const Dashboard = () => {
    const {data: session, status} = useSession()
    console.log("SESSION", session)
    console.log("SESSION from useSession", status)

    if (status == "loading") return <Spinner/>

    if (session?.user.role === "super_admin") {
        return <SuperAdminDashboard/>
    }
    //TODO
    // Check this conditional
    // else if (session?.user.scope === "store_admin") {
    //     return <StoreAdminDashboard storeId={session.user.storeId}/>;
    // } else {
    //     return <AccessDenied/>
    // }
};

export default Dashboard;