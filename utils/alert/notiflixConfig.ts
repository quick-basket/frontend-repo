import Notiflix from 'notiflix';

let isNotiflixInitialized = false;

const initializeNotiflix = () => {
    if (typeof window !== 'undefined' && !isNotiflixInitialized) {
        Notiflix.Notify.init({
            position: 'right-top',
            zindex: 99999999,
            closeButton: false,
            showOnlyTheLastOne: true,
        });

        Notiflix.Confirm.init({
            plainText: false,
            titleColor: '#3085d6',
            okButtonBackground: '#3085d6',
            cancelButtonBackground: '#d33',
            position: 'center',
            zindex: 99999999,
            backOverlayColor: 'rgba(0,0,0,0.5)',
        });

        isNotiflixInitialized = true;
    }
};

export const confirmAlert = (title: string, text: string): Promise<boolean> => {
    initializeNotiflix();
    return new Promise((resolve) => {
        if (typeof window !== 'undefined') {
            Notiflix.Confirm.show(
                title,
                text,
                'Yes',
                'No',
                () => resolve(true),
                () => resolve(false),
                {
                    zindex: 9999999999, // Ensure this is the highest z-index
                    cssAnimationStyle: 'zoom', // This can help with rendering issues
                }
            );
        } else {
            resolve(false);
        }
    });
};

interface NotifyOptions {
    text: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    timeout?: number;
}

export const notify = ({ text, type = 'info', timeout = 3000 }: NotifyOptions): void => {
    initializeNotiflix();
    if (typeof window !== 'undefined') {
        const options = { timeout };

        switch (type) {
            case 'success':
                Notiflix.Notify.success(text, options);
                break;
            case 'warning':
                Notiflix.Notify.warning(text, options);
                break;
            case 'error':
                Notiflix.Notify.failure(text, options);
                break;
            default:
                Notiflix.Notify.info(text, options);
        }
    }
};