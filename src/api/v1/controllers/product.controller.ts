import { NextFunction, Response } from 'express';
import { CustomError, CustomSuccess, GetUserAuthInfoRequestInterface, TARGETED_IMG_SIZE } from '../shared';
import { compressImage, handleImageValidity } from '../helpers';
import { existsSync, mkdirSync, writeFile } from 'fs';
import path from 'path';

export const uploadProductImage = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const { PUBLIC_DIRECTORY_PATH } = <Record<string, string>>process.env;
  const UPLOAD_DIRECTORY_PATH = path.join(PUBLIC_DIRECTORY_PATH, 'uploads');
  let productImgFile = <Express.Multer.File>req?.file;
  const imgExtension = productImgFile.mimetype.split('/')[1];
  try {
    handleImageValidity(productImgFile);

    if (productImgFile.size > TARGETED_IMG_SIZE) {
      productImgFile = await compressImage(productImgFile, TARGETED_IMG_SIZE);
    }

    if (!existsSync(UPLOAD_DIRECTORY_PATH)) {
      mkdirSync(UPLOAD_DIRECTORY_PATH, { recursive: true });
    }

    const imagePath = path.join(UPLOAD_DIRECTORY_PATH,  'imageName' + '.' + imgExtension);

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
