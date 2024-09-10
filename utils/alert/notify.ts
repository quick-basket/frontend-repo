import Notiflix from 'notiflix';

type AlertType = 'success' | 'info' | 'warning' | 'error';

interface NotifyOptions {
    title: string;
    text?: string;
    type?: AlertType;
    timer?: number;
}

export const notify = ({
                           title,
                           text = '',
                           type = 'info',
                           timer
                       }: NotifyOptions) => {
    Notiflix.Notify.init({
        timeout: timer,
        plainText: false,
    });

    switch (type) {
        case 'success':
            Notiflix.Notify.success(text);
            break;
        case 'warning':
            Notiflix.Notify.warning(text);
            break;
        case 'error':
            Notiflix.Notify.failure(text);
            break;
        default:
            Notiflix.Notify.info(text);
    }
};

export const confirmAlert = (title: string, text: string) => {
    return new Promise((resolve) => {
        Notiflix.Confirm.show(
            title,
            text,
            'Yes',
            'No',
            () => resolve(true),
            () => resolve(false),
            {
                titleColor: '#3085d6',
                okButtonBackground: '#3085d6',
                cancelButtonBackground: '#d33',
            },
        );
    });
};

// Usage example:
// notify({ title: 'Hello', text: 'World', type: 'success', timer: 3000 });
// const result = await confirmAlert('Are you sure?', 'This action cannot be undone');
// if (result) { /* User clicked Yes */ } else { /* User clicked No */ }