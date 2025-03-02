import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/landingPage/landingPageNavbar';
import CreateProductForm from '@/components/adminPage/createProductForm';


export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminAuth();
    }, []);

    const checkAdminAuth = () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                router.push('/login');
                return;
            }

            const user = JSON.parse(userData);
            if (user.role !== 'ADMIN') {
                router.push('/');
                return;
            }

            setLoading(false);
        } catch (error) {
            console.error('Admin auth check failed:', error);
            router.push('/login');
        }
    };

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