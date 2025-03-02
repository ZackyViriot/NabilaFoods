import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}

export default function CartModal({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartModalProps) {
    const router = useRouter();

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        onClose();
        router.push('/checkout');
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                <div className="flex items-center justify-between border-b p-4">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-gray-600" />
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            Your Cart
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto p-4">
                                    {items.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                                            <p className="mt-2 text-gray-500">Your cart is empty</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex items-center py-4 border-b">
                                                    <div className="relative w-20 h-20 flex-shrink-0">
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            fill
                                                            className="rounded-lg object-cover"
                                                            sizes="(max-width: 768px) 80px, 80px"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 text-gray-400 hover:text-gray-500"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onRemoveItem(item.id)}
                                                            className="ml-2 p-1 text-red-400 hover:text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {items.length > 0 && (
                                    <div className="border-t p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-base font-medium text-gray-900">Total</span>
                                            <span className="text-lg font-semibold text-green-600">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 