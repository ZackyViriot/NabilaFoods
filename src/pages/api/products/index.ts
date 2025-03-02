import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
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

      // Transform the response to include image URLs
      const productsWithUrls = products.map(({ imageData, imageMime, ...rest }) => ({
        ...rest,
        imageUrl: `/api/products/${rest.id}/image`
      }));

      res.status(200).json(productsWithUrls);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}