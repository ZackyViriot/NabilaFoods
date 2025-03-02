import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const { productId, rating, comment } = req.body;

        // Validate required fields
        if (!productId || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Only allow ratings of 4 and up
        if (rating < 4) {
            return res.status(400).json({ error: 'Only ratings of 4 stars and above are accepted' });
        }

        // Create the review
        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                userId: decoded.userId,
                productId
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Review creation error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Failed to create review' });
    }
} 