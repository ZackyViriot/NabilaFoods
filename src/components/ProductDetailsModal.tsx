import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
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

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export default function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

    const handleReviewSubmitted = () => {
        setIsReviewModalOpen(false);
        // TODO: Refresh product data
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                    <div className="relative w-full h-64 mb-4">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="rounded-lg object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>

                                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">
                                        {product.name}
                                    </Dialog.Title>

                                    <p className="text-gray-600 mb-4">{product.description}</p>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                                            <span className="font-medium">{averageRating.toFixed(1)}</span>
                                            <span className="text-gray-500">({product.reviews.length} reviews)</span>
                                        </div>
                                        <span className="text-2xl font-bold text-green-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold">Customer Reviews</h4>
                                            <button
                                                onClick={() => setIsReviewModalOpen(true)}
                                                className="flex items-center gap-2 text-green-600 hover:text-green-700"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Write a Review
                                            </button>
                                        </div>

                                        {product.reviews.length > 0 ? (
                                            <div className="space-y-6">
                                                {product.reviews.map((review) => (
                                                    <div key={review.id} className="border-b pb-6">
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
                                                                                ? 'text-yellow-400'
                                                                                : 'text-gray-300'
                                                                        }`}
                                                                        fill="currentColor"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-8">
                                                No reviews yet. Be the first to review!
                                            </p>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </>
    );
} 