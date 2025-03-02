import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting file upload process');
    
    // Create a temporary directory for file upload
    const tmpDir = '/tmp';
    const form = formidable({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Parse the form data
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(err);
        }
        resolve([fields, files]);
      });
    });

    // Get the uploaded file
    const uploadedFile = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!uploadedFile) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', {
      name: uploadedFile.originalFilename,
      type: uploadedFile.mimetype,
      size: uploadedFile.size
    });

    // Read the file data
    const imageData = await fs.readFile(uploadedFile.filepath);
    console.log('File read successfully, size:', imageData.length);

    // Store the image data temporarily
    const tempImage = await prisma.tempUpload.create({
      data: {
        imageData: imageData,
        imageMime: uploadedFile.mimetype || 'image/jpeg',
        createdAt: new Date(),
      },
    });

    console.log('Temporary image stored with ID:', tempImage.id);

    // Clean up the temporary file
    await fs.unlink(uploadedFile.filepath);

    // Return the temporary image ID
    return res.status(200).json({ tempImageId: tempImage.id });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error uploading file' });
  }
} 