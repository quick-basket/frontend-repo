"use client"

import React, {useEffect, useState} from 'react';
import {notify} from "@/utils/alert/notiflixConfig";
import {useRouter} from "next/navigation";

const UnauthorizedAccess: React.FC = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(2);

    useEffect(() => {
        notify({ text: 'You are not authorized to access this page.', type: 'error' });

        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            router.push('/'); // Redirect to home page or login page after 2 seconds
        }, 2000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="text-xl text-gray-600">You do not have permission to view this page.</p>
                <p className="mt-4">Redirecting you to the home page...</p>
            </div>
        </div>
    );
};

export default UnauthorizedAccess;