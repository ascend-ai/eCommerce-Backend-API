import { NextFunction, Response } from 'express';
import { CustomError, CustomSuccess, GetUserAuthInfoRequestInterface } from '../shared';
import { compressImage } from '../helpers';
import { existsSync, mkdirSync, writeFile } from 'fs';
import path from 'path';

export const uploadProductImage = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const { PUBLIC_DIRECTORY_PATH } = <Record<string, string>>process.env;
  const UPLOAD_DIRECTORY_PATH = path.join(PUBLIC_DIRECTORY_PATH, 'uploads');
  const ACCEPTED_IMG_EXTENSIONS = ['jpeg', 'jpg', 'png'];
  const TARGET_SIZE = 100 * 1024;
  let productImgFile = <Express.Multer.File>req?.file;
  try {
    if (!productImgFile) {
      throw new Error('File is not attached.')
    }
    const [type, extension] = productImgFile.mimetype.split('/');
    if (type !== 'image') {
      throw new Error('Only image as a file is accepted.')
    }
    if (!ACCEPTED_IMG_EXTENSIONS.includes(extension)) {
      throw new Error(`${ACCEPTED_IMG_EXTENSIONS.join(', ')} are the only accepted image formats.`);
    }
    if (productImgFile.size > TARGET_SIZE) {
      productImgFile = await compressImage(productImgFile, TARGET_SIZE);
    }
    if (!existsSync(UPLOAD_DIRECTORY_PATH)) {
      mkdirSync(UPLOAD_DIRECTORY_PATH, { recursive: true });
    }
    const imagePath = path.join(UPLOAD_DIRECTORY_PATH,  'resort' + '.' + extension)
    writeFile(imagePath, productImgFile.buffer, (err) => {
      if (err) {
        throw new Error('Error saving image.');
      }
    });
    next(new CustomSuccess(null, 200));
  } catch (error: any) {
    next(new CustomError(error.message, 400));
  }
}
