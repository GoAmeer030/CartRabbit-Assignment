import { useEffect } from 'react';

export default function AdminRedirect() {
    useEffect(() => {
        const baseUrl = import.meta.env.VITE_SERVER_URL.split("/").slice(0, -1).join("/");
        const url = `${baseUrl}/admin/`;
        window.location.href = url;
    }, []);

    return null;
}