import sharp from 'sharp';
import { ACCEPTED_IMG_EXTENSIONS } from '../shared';

export const compressImage = async (imgFile: Express.Multer.File, targetSize: number): Promise<Express.Multer.File> => {
  try {
    let quality = 100;
    do {
      const image = sharp(imgFile.buffer);
      const imageWidth = (await image.metadata()).width;
      const currentSize = imgFile.size;
      const scaleFactor = Math.sqrt(targetSize / currentSize);
      imgFile.buffer = await image.resize(Math.round(<number>imageWidth * scaleFactor))
        .jpeg({ quality })
        .toBuffer();
      imgFile.size = Buffer.byteLength(imgFile.buffer);
      if (imgFile.size <= targetSize) {
        return imgFile;
      }
      quality -= 1;
    } while (quality >= 10);
    return imgFile;
    
  } catch (error) {
    throw error;
  }
};

export const handleImageValidity = (imgFile: Express.Multer.File): void => {
  if (!imgFile) {
    throw new Error('File is not attached.')
  }

  const [type, extension] = imgFile.mimetype.split('/');

  if (type !== 'image') {
    throw new Error('Only image as a file is accepted.')
  }

  if (!ACCEPTED_IMG_EXTENSIONS.includes(extension)) {
    throw new Error(`${ACCEPTED_IMG_EXTENSIONS.join(', ')} are the only accepted image formats.`);
  }
};