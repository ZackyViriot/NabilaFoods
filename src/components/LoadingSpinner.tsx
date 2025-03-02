import { Utensils } from 'lucide-react';

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-bounce bg-green-50 rounded-full p-4 mb-4">
                <Utensils className="w-8 h-8 text-green-600 animate-spin" />
            </div>
            <p className="text-gray-600 animate-pulse">Loading delicious dishes...</p>
        </div>
    );
} 