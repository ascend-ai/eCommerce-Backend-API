import sharp from 'sharp';
import { ACCEPTED_IMG_EXTENSIONS, TARGETED_IMG_SIZE } from '../shared';
import path from 'path';
import { ProductImageModel } from '../data-models';
import { existsSync, mkdirSync, writeFile } from 'fs';
import { ClientSession, Types } from 'mongoose';
import { unlink } from 'fs/promises';

/**
 * Create image in the database.
 * @param imgFile
 * @param productId
 * @param session 
 */
export const createProductImage = async (imgFile: Express.Multer.File,
                                         productId: Types.ObjectId,
                                         session: ClientSession): Promise<Types.ObjectId> => {
  if (!imgFile) {
    throw new Error('File is not attached.')
  }

  const [imgType, imgExtension] = imgFile.mimetype.split('/');

  if (imgType !== 'image') {
    throw new Error('Only image as a file is accepted.')
  }

  if (!ACCEPTED_IMG_EXTENSIONS.includes(imgExtension)) {
    throw new Error(`${ACCEPTED_IMG_EXTENSIONS.join(', ')} are the only accepted image formats.`);
  }

  const productImg = new ProductImageModel();

  // ! EDITING ARGUMENT DIRECTLY (CALL BY REFERENCE)
  imgFile.originalname = `product_${productId}_img_${productImg._id}.${imgExtension}`;

  productImg.url = `/uploads/${imgFile.originalname}`;
  await productImg.save({ session });
  return productImg._id;
}

/**
 * Save image into the folder.
 * @param imgFile 
 */
export const uploadProductImageFile = async (imgFile: Express.Multer.File): Promise<void> => {
  const { PUBLIC_DIRECTORY_PATH } = <Record<string, string>>process.env;
  const UPLOAD_DIRECTORY_PATH = path.join(PUBLIC_DIRECTORY_PATH, 'uploads');
  const imgPath = path.join(UPLOAD_DIRECTORY_PATH,  imgFile.originalname);

  if (!existsSync(UPLOAD_DIRECTORY_PATH)) {
    mkdirSync(UPLOAD_DIRECTORY_PATH, { recursive: true });
  }

  if (imgFile.size > TARGETED_IMG_SIZE) {

    // ! EDITING ARGUMENT DIRECTLY (CALL BY REFERENCE)
    imgFile = await compressImage(imgFile, TARGETED_IMG_SIZE);
  }

  await writeFile(imgPath, imgFile.buffer, (err) => {
    if (err) {
      throw new Error('Error saving image.');
    }
  });
};

/**
 * 
 * @param imageFilePath 
 */
export const deleteProductImageFile = async (relativeImgPath: string): Promise<void> => {
  try {
    const { PUBLIC_DIRECTORY_PATH } = <Record<string, string>>process.env;
    const absoluteImgPath = path.join(PUBLIC_DIRECTORY_PATH,  relativeImgPath);
    await unlink(absoluteImgPath);
  } catch (error) {
    throw new Error(`Error deleting image.`);
  }
}

/**
 * Compress image under the size of 100 KB
 * @param imgFile 
 * @param targetSize 
 * @returns 
 */
export const compressImage = async (imgFile: Express.Multer.File, targetSize: number): Promise<Express.Multer.File> => {
  try {
    let quality = 100;
    do {
      const img = sharp(imgFile.buffer);
      const imgWidth = (await img.metadata()).width;
      const currentSize = imgFile.size;
      const scaleFactor = Math.sqrt(targetSize / currentSize);
      imgFile.buffer = await img.resize(Math.round(<number>imgWidth * scaleFactor))
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

/**
 * 
 * @param arr1
 * @param arr2
 * @returns
 */
export const doesArraysHaveSimilarElements = (arr1: Array<any>, arr2: Array<any>): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) {
    return false;
  }

  for (let item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }

  return true;
};
