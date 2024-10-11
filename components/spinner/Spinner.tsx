import React from 'react';

interface SpinnerProps {
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ fullScreen = false, size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'h-4 w-4 border-2',
        medium: 'h-8 w-8 border-3',
        large: 'h-16 w-16 border-4',
    };

    const spinnerClasses = `
    animate-spin rounded-full 
    border-blue-500 border-opacity-75 
    ${sizeClasses[size]}
    ${className}
  `;

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
                <div className={spinnerClasses}></div>
            </div>
        );
    }

    return <div className={spinnerClasses}></div>;
};

export default Spinner;