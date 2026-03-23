import { toast } from 'react-toastify';

export default function toastHelper() {
    return {
        default: (msg: string) => toast(msg, {
            style: {
                background: "linear-gradient(to right, #2551a8, #72419d)",
                '--toastify-toast-width': '320px',
                '--toastify-toast-min-height': '70px',
                '--toastify-toast-max-height': '70px',
                'fontSize': 'clamp(0.8rem, 2vw, 1rem)',
            } as React.CSSProperties,
            position: "top-right",
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: true,
            theme: "dark"
            }),
        error: (msg: string) => toast.error(msg, {
            style: {
                background: "linear-gradient(to right, #7b001b, #b33b4b)",
                '--toastify-toast-width': '320px',
                '--toastify-toast-min-height': '70px',
                '--toastify-toast-max-height': '70px',
                'fontSize': 'clamp(0.8rem, 2vw, 1rem)',
            } as React.CSSProperties,
            position: "top-right",
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: true,
            theme: "colored"
            }),
    };
}