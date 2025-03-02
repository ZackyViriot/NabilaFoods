import { useState, useRef } from 'react';
import axios from 'axios';

export default function CreateProductForm() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [tempImageId, setTempImageId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
    });

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTempImageId(response.data.tempImageId);
            setSelectedImage(URL.createObjectURL(file));
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to upload image');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleImageUpload(file);
        }
    };

    const handleCameraCapture = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!tempImageId) {
            setError("Please upload an image first");
            return;
        }

        setError("");
        setLoading(true);
        setSuccess(false);

        try {
            const res = await axios.post("/api/products", {
                ...formData,
                tempImageId,
            });
            setSuccess(true);
            setFormData({
                name: "",
                description: "",
                price: 0,
            });
            setSelectedImage(null);
            setTempImageId(null);
        } catch (error: any) {
            setError(error.response?.data?.error || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
            
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                    Product created successfully!
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <div className="flex">
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="0.00"
                                />
                                <div className="flex flex-col border-l-0">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, price: prev.price + 1 }))}
                                        className="px-2 py-1 border border-l-0 border-gray-300 bg-gray-50 rounded-tr-md hover:bg-gray-100"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, price: Math.max(0, prev.price - 1) }))}
                                        className="px-2 py-1 border border-t-0 border-l-0 border-gray-300 bg-gray-50 rounded-br-md hover:bg-gray-100"
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image
                        </label>
                        <div className="flex flex-col items-center space-y-2">
                            {selectedImage && (
                                <div className="relative w-full h-48 mb-4">
                                    <img
                                        src={selectedImage}
                                        alt="Selected product"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Upload Image
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCameraCapture}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Take Photo
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}