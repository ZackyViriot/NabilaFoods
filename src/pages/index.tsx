// this is the landing page / route 
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link';
import LandingPageNavbar from "@/components/landingPage/landingPageNavbar";
import ProductCard from '@/components/ProductCard';
import ReviewModal from '@/components/ReviewModal';
import { Star, ArrowRight, MessageSquare } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Review {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    createdAt: Date;
    user?: {
        name: string;
    };
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    reviews: Review[];
}

export default function LandingPage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            // For now, just show the top 4 rated products as featured
            const sortedByRating = response.data.sort((a: Product, b: Product) => {
                const aRating = a.reviews?.reduce((acc, r) => acc + r.rating, 0) || 0;
                const bRating = b.reviews?.reduce((acc, r) => acc + r.rating, 0) || 0;
                return bRating - aRating;
            });
            setFeaturedProducts(sortedByRating.slice(0, 4));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewClick = (productId: string) => {
        setSelectedProductId(productId);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmitted = () => {
        fetchFeaturedProducts(); // Refresh products to show new review
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Viriot Foods",
        "image": "/logo.png",
        "description": "Discover our delicious selection of meals prepared just for you",
        "menu": {
            "@type": "Menu",
            "hasMenuSection": {
                "@type": "MenuSection",
                "name": "Featured Dishes",
                "hasMenuItem": featuredProducts.map(product => ({
                    "@type": "MenuItem",
                    "name": product.name,
                    "description": product.description,
                    "price": `$${product.price.toFixed(2)}`,
                    "image": product.imageUrl
                }))
            }
        }
    };

    return (
        <>
            <Head>
                <title>Viriot Foods | Delicious Food Delivered to Your Door</title>
                <meta name="description" content="Order delicious meals from Viriot Foods. Fresh ingredients, amazing flavors, and quick delivery to your doorstep." />
                <meta name="keywords" content="food delivery, restaurant, online ordering, fresh food" />
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <LandingPageNavbar/>
                
                {/* Hero Section */}
                <div className="relative bg-green-600 text-white py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Delicious Food,
                                <br />
                                Delivered to You
                            </h1>
                            <p className="text-xl mb-8 text-green-50">
                                Experience the finest selection of meals prepared with fresh ingredients and delivered right to your doorstep
                            </p>
                            <Link 
                                href="/menu"
                                className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-200"
                            >
                                View Full Menu
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Featured Products Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Featured Dishes
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    Our most popular and highly rated dishes
                                </p>
                            </div>
                            <Link 
                                href="/menu"
                                className="text-green-600 hover:text-green-700 font-medium flex items-center"
                            >
                                View All
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                        
                        {loading ? (
                            <div className="text-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {featuredProducts.map(product => (
                                        <div key={product.id}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Reviews Section */}
                                <div className="mt-16">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {featuredProducts.map(product => 
                                            product.reviews?.slice(0, 1).map(review => (
                                                <div 
                                                    key={review.id} 
                                                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                                <span className="text-green-600 font-semibold">
                                                                    {review.user?.name?.charAt(0) || 'A'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {review.user?.name || 'Anonymous'}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${
                                                                            i < review.rating
                                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                                : 'text-gray-300'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                for {product.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="relative">
                                                        <p className="text-gray-600 line-clamp-3">{review.comment}</p>
                                                        {review.comment.length > 150 && (
                                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🌟</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
                                <p className="text-gray-600">We use only the freshest ingredients in all our dishes</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🚚</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                                <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">💝</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
                                <p className="text-gray-600">Every dish is prepared with care and attention</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-green-50 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Order?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Explore our full menu and find your perfect meal. We're ready to serve you with the best dishes made from the freshest ingredients.
                        </p>
                        <Link 
                            href="/menu"
                            className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200"
                        >
                            Order Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </section>
            </div>

            {selectedProductId && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => {
                        setIsReviewModalOpen(false);
                        setSelectedProductId(null);
                    }}
                    productId={selectedProductId}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}

            {isDetailsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                        <div className="flex h-full">
                            {/* Left side - Product Details */}
                            <div className="w-1/2 p-8 border-r border-gray-200">
                                <div className="aspect-w-16 aspect-h-12 mb-6">
                                    <img
                                        src={selectedProduct?.imageUrl}
                                        alt={selectedProduct?.name}
                                        className="w-full h-[300px] object-cover rounded-xl"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    {selectedProduct?.name}
                                </h2>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {selectedProduct?.description}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                                        <span className="font-medium text-gray-900">
                                            {selectedProduct && selectedProduct.reviews.length > 0
                                                ? (selectedProduct.reviews.reduce((acc, r) => acc + r.rating, 0) / selectedProduct.reviews.length).toFixed(1)
                                                : '0.0'
                                            }
                                        </span>
                                        <span className="text-gray-500">
                                            ({selectedProduct?.reviews?.length || 0} reviews)
                                        </span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">
                                        ${selectedProduct?.price.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsDetailsModalOpen(false);
                                        handleReviewClick(selectedProduct?.id || '');
                                    }}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Write a Review
                                </button>
                            </div>

                            {/* Right side - Reviews */}
                            <div className="w-1/2 p-8 overflow-y-auto max-h-[90vh]">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                                    <button
                                        onClick={() => setIsDetailsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {selectedProduct?.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                        <span className="text-green-600 font-semibold text-lg">
                                                            {review.user?.name?.charAt(0) || 'A'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {review.user?.name || 'Anonymous'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${
                                                                i < review.rating
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}