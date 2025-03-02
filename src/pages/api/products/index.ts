import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate database connection
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      error: 'Database connection failed', 
      details: error instanceof Error ? error.message : 'Unknown error',
      env: process.env.NODE_ENV,
      hasUrl: !!process.env.DATABASE_URL
    });
  }

  if (req.method === 'POST') {
    const { name, description, price, tempImageId } = req.body;

    try {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { name },
      });

      if (existingProduct) {
        return res.status(400).json({ error: 'Product already exists' });
      }

      let imageData;
      let imageMime;

      if (tempImageId) {
        // Get the temporary image data
        const tempImage = await prisma.tempUpload.findUnique({
          where: { id: tempImageId },
        });

        if (!tempImage) {
          return res.status(400).json({ error: 'Image not found' });
        }

        imageData = tempImage.imageData;
        imageMime = tempImage.imageMime;
      }

      // Create the product with the image data
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          ...(imageData ? { imageData, imageMime } : {}),
        },
      });

      // Delete the temporary image if it exists
      if (tempImageId) {
        await prisma.tempUpload.delete({
          where: { id: tempImageId },
        });
      }

      // Don't send the image data back in the response
      const { imageData: _, ...productWithoutImage } = product;
      res.status(201).json({
        ...productWithoutImage,
        imageUrl: `/api/products/${product.id}/image`
      });
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else if (req.method === 'GET') {
    try {
      console.log('Fetching products...');
      
      const products = await prisma.product.findMany({
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      console.log('Products fetched successfully:', products.length);

      const productsWithUrls = products.map(({ imageData, imageMime, ...rest }) => ({
        ...rest,
        imageUrl: `/api/products/${rest.id}/image`
      }));

      return res.status(200).json(productsWithUrls);
    } catch (error) {
      console.error('Error fetching products:', error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({ 
          error: 'Database error', 
          code: error.code,
          message: error.message
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to fetch products', 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}