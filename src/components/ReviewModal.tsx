import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    onReviewSubmitted: () => void;
}

export default function ReviewModal({ isOpen, onClose, productId, onReviewSubmitted }: ReviewModalProps) {
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [isOpen]);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated) {
            router.push('/login');
            onClose();
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/reviews', 
                {
                    productId,
                    rating,
                    comment
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            onReviewSubmitted();
            onClose();
            setRating(5);
            setComment('');
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to submit review';
            setError(errorMessage);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                                <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-4">
                                    Write a Review
                                </Dialog.Title>

                                {!isAuthenticated && (
                                    <div className="mb-4 p-4 rounded-lg bg-yellow-50 text-yellow-800 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Authentication Required</p>
                                            <p className="text-sm">Please sign in to leave a review.</p>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rating
                                        </label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="p-1 transition-colors"
                                                    disabled={!isAuthenticated}
                                                >
                                                    <Star 
                                                        className={`w-8 h-8 ${
                                                            star <= rating 
                                                                ? 'text-yellow-400 fill-yellow-400' 
                                                                : 'text-gray-300'
                                                        } ${!isAuthenticated ? 'opacity-50' : ''}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Review
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows={4}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder={isAuthenticated ? "Share your experience with this dish..." : "Please sign in to write a review"}
                                            required
                                            disabled={!isAuthenticated}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !isAuthenticated}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                                                isSubmitting || !isAuthenticated
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        >
                                            {!isAuthenticated ? 'Sign in to Review' : isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 