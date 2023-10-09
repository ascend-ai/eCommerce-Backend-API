import sharp from 'sharp';

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
}