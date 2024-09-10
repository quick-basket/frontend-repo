import Swal from 'sweetalert2';

type AlertType = 'success' | 'info' | 'warning' | 'error';

interface SwalAlertOptions{
    title: string;
    text?: string;
    icon?: AlertType;
    timer?: number;
    showConfirmButton?: boolean;
}

export const swalAlert = ({
    title,
    text = '',
    icon = 'info',
    timer,
    showConfirmButton = true
}: SwalAlertOptions) => {
    return Swal.fire({
        title,
        text,
        icon,
        timer,
        showConfirmButton,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    });
};

export const swalConfirm = (title: string, text: string) => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        customClass: {
            container: 'swal-container'
        },
        target: document.body,
    });
};