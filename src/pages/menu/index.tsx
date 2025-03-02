import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import LandingPageNavbar from '@/components/landingPage/landingPageNavbar';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    createdAt: Date;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    reviews: Review[];
}

export default function MenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            setError('Failed to load products');
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            // Sort by rating
            const aRating = a.reviews?.reduce((acc, r) => acc + r.rating, 0) || 0;
            const bRating = b.reviews?.reduce((acc, r) => acc + r.rating, 0) || 0;
            return bRating - aRating;
        });

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Viriot Foods",
        "image": "/logo.png",
        "menu": {
            "@type": "Menu",
            "hasMenuSection": {
                "@type": "MenuSection",
                "name": "Full Menu",
                "hasMenuItem": products.map(product => ({
                    "@type": "MenuItem",
                    "name": product.name,
                    "description": product.description,
                    "price": `$${product.price.toFixed(2)}`,
                    "image": product.imageUrl
                }))
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LandingPageNavbar />
                <div className="container mx-auto px-4 py-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LandingPageNavbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-red-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Menu - Viriot Foods | Delicious Food Delivered</title>
                <meta name="description" content="Explore our delicious menu featuring a wide variety of dishes. Fresh ingredients, amazing flavors, and quick delivery." />
                <meta name="keywords" content="food delivery, restaurant menu, online ordering, fresh food" />
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <LandingPageNavbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Menu</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Discover our delicious selection of dishes made with fresh ingredients
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search dishes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="rating">Top Rated</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {filteredAndSortedProducts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No products found matching your search.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
} 