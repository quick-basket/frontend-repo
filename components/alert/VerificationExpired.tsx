import React from 'react';
import {TriangleAlert} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

const VerificationExpired = () => {
    return (
        <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Your verification code has expired. Please register again.
            </AlertDescription>
        </Alert>
    );
};

export default VerificationExpired;