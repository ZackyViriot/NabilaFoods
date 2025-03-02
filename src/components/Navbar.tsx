import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';

export default function Navbar() {
    const { itemCount, isCartOpen, setIsCartOpen, items, updateQuantity, removeItem } = useCart();
    const [isCartBouncing, setIsCartBouncing] = useState(false);

    // Add bounce animation when itemCount changes
    useEffect(() => {
        if (itemCount > 0) {
            setIsCartBouncing(true);
            const timeout = setTimeout(() => setIsCartBouncing(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [itemCount]);

    return (
        <>
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/" className="flex items-center">
                                <span className="text-xl font-bold text-gray-800">Recipes To Go</span>
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <Link href="/menu" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                Menu
                            </Link>
                            <Link href="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                Admin
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className={`relative ml-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-transform duration-300 ${
                                    isCartBouncing ? 'animate-bounce' : ''
                                }`}
                            >
                                <ShoppingBag className="h-6 w-6" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 transform scale-100">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
            />
        </>
    );
} 