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
        console.log("token used", token)
        console.log("orderId", orderId)
        window.snap.pay(token, {
            onSuccess: (result) => {
                console.log('Payment success!', result);
                onTokenStatusChange('used');
                onSuccess(result);
            },
            onPending: (result) => {
                console.log('Payment pending', result);
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
                console.log('Customer closed the popup without finishing payment');
                // You might want to handle this case differently
                // For example, you could keep the token status as 'fresh'
                // if the user hasn't interacted with the payment method yet
            }
        });
    } else {
        console.error('Snap.js is not loaded');
    }
};