const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const config = {
  baseUrl: getBaseUrl(),
  imageUrl: (productId: string) => `${getBaseUrl()}/api/products/${productId}/image`,
  apiRoutes: {
    products: `${getBaseUrl()}/api/products`,
    auth: {
      login: `${getBaseUrl()}/api/auth/login`,
      register: `${getBaseUrl()}/api/auth/register`,
    },
    reviews: `${getBaseUrl()}/api/reviews`,
    upload: `${getBaseUrl()}/api/upload`,
  },
}; 