import React from 'react';
import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import locationAnimationData from "@/animation/warning.json"// You'll need to download and add this file

interface LocationSelectionPromptProps {
    onShowDialog: () => void;
}

const LocationSelectionPrompt: React.FC<LocationSelectionPromptProps> = ({ onShowDialog }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100">
            <div className="w-64 h-64 mb-8">
                <Lottie animationData={locationAnimationData} loop={true} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Choose Your Store Location</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                To start shopping, please select a store location. This helps us show you products available in your area.
            </p>
            <Button onClick={onShowDialog} className="px-6 py-2">
                Select Location
            </Button>
        </div>
    );
};

export default LocationSelectionPrompt;