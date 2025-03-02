import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailsModal from './ProductDetailsModal';
import ReviewModal from './ReviewModal';
import Image from 'next/image';

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

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const { addItem } = useCart();

    const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

    const highlyRated = averageRating >= 4;
    const highRatedReviews = product.reviews.filter(review => review.rating >= 4);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        });
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div 
                    className="relative cursor-pointer"
                    onClick={() => setIsDetailsModalOpen(true)}
                >
                    <div className="relative w-full h-48">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    {highlyRated && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center z-10">
                            <Star className="w-3 h-3 mr-1" />
                            Top Rated
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowReviews(true);
                            }}
                            className="flex items-center space-x-1 hover:text-green-600 transition-colors"
                        >
                            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                            <span className="text-sm font-medium text-gray-700">
                                {averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({product.reviews.length})
                            </span>
                        </button>
                        <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsReviewModalOpen(true);
                            }}
                            className="w-full border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Star className="w-4 h-4" />
                            Write a Review
                        </button>
                    </div>
                </div>
            </div>

            <ProductDetailsModal
                product={product}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                onReviewSubmitted={() => {
                    setIsReviewModalOpen(false);
                    // You might want to refresh the product data here
                }}
            />

            {/* Reviews Modal */}
            {showReviews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Reviews for {product.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Showing {highRatedReviews.length} reviews rated 4 stars and above</p>
                                </div>
                                <button
                                    onClick={() => setShowReviews(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
                                {highRatedReviews.length > 0 ? (
                                    highRatedReviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-6">
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
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-8">
                                        No reviews 4 stars or above yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 