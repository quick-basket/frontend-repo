export const initializeSnapPayment = (
    token: string,
    orderId: number,
    onSuccess: (result: any) => void,
    onError: (result: any) => void,
    onPending: (result: any) => void,
    onClose: () => void,
    onTokenStatusChange: (status: 'used' | 'expired') => void
) => {
    if (window.snap) {
        window.snap.pay(token, {
            onSuccess: (result) => {
                onTokenStatusChange('used');
                onSuccess(result);
            },
            onPending: (result) => {
                localStorage.setItem('SNAP_TOKEN', JSON.stringify({token, orderId}));
                onTokenStatusChange('used');
                onPending(result);
            },
            onError: (result) => {
                console.error('Payment error!', result);
                onTokenStatusChange('expired');
                onError(result);
            },
            onClose: () => {
                // You might want to handle this case differently
                // For example, you could keep the token status as 'fresh'
                // if the user hasn't interacted with the payment method yet
            }
        });
    } else {
        console.error('Snap.js is not loaded');
    }
};