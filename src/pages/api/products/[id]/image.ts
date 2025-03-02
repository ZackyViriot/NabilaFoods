import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    console.log('Fetching image for product:', id);
    
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
      select: {
        imageData: true,
        imageMime: true,
      },
    });

    console.log('Product found:', {
      hasImage: !!product?.imageData,
      mime: product?.imageMime
    });

    if (!product || !product.imageData) {
      console.log('No image found, redirecting to placeholder');
      res.redirect('/placeholder-food.jpg');
      return;
    }

    // Convert Buffer to proper format if needed
    const imageBuffer = Buffer.from(product.imageData);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', product.imageMime || 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.redirect('/placeholder-food.jpg');
  }
} 