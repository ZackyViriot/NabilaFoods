import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/landingPage/landingPageNavbar';
import CreateProductForm from '@/components/adminPage/createProductForm';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const checkAdminAuth = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setLoading(false);
    }, [router]);

    useEffect(() => {
        checkAdminAuth();
    }, [checkAdminAuth]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <CreateProductForm />
        </div>
    );
} 