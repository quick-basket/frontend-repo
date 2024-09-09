import React from 'react';
import {Label} from "@/components/ui/label";
import {AlertTriangle, CheckCircle } from 'lucide-react';
import {Button} from "@/components/ui/button";

interface VerificationStatusProps {
    isVerified: boolean;
    onResendVerification: () => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({isVerified, onResendVerification}) => {
    return (
        <div className="mt-6">
            <Label className="text-lg font-semibold">Verification Status</Label>
            <div className="mt-2">
                {isVerified ? (
                    <div className="flex items-center p-3 bg-green-100 rounded-md">
                        <CheckCircle className="text-green-500 h-5 w-5 mr-2"/>
                        <span className="text-green-700 font-medium">Verified</span>
                    </div>
                ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center mb-2">
                            <AlertTriangle className="text-yellow-500 h-6 w-6 mr-2"/>
                            <span className="text-yellow-700 font-medium">Account Not Verified</span>
                        </div>
                        <p className="text-sm text-yellow-600 mb-3">
                            Your account is not verified. Please verify your account to access all features.
                        </p>
                        <Button
                            onClick={onResendVerification}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                            Resend Verification Link
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationStatus;