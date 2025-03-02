import { useState, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';

interface FormData {
    name: string;
    description: string;
    price: string;
    image: File | null;
}

export default function CreateProductForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        price: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            // First, upload the image if one is selected
            let tempImageId = '';
            if (formData.image) {
                const formDataWithImage = new FormData();
                formDataWithImage.append('image', formData.image);

                const uploadResponse = await axios.post('/api/upload', formDataWithImage);
                tempImageId = uploadResponse.data.tempImageId;
            }

            // Then create the product
            await axios.post('/api/products', {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                tempImageId
            });

            setSuccess('Product created successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                image: null
            });
            setPreviewUrl('');
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || 'Failed to create product');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Product Image
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
                />
            </div>

            {previewUrl && (
                <div className="mt-4">
                    <div className="relative w-48 h-48">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="rounded-lg object-cover"
                            sizes="(max-width: 768px) 192px, 192px"
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="text-red-600 text-sm">{error}</div>
            )}

            {success && (
                <div className="text-green-600 text-sm">{success}</div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isLoading ? 'Creating...' : 'Create Product'}
            </button>
        </form>
    );
}