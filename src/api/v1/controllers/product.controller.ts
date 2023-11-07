import { NextFunction, Response } from 'express';
import { CreateProductDto, CustomError, CustomSuccess, GetUserAuthInfoRequestInterface, MAX_IMAGES_PER_PRODUCT, ProductCategoryInterface } from '../shared';
import mongoose, { ClientSession, Types } from 'mongoose';
import { ProductCategoryModel, ProductImageModel, ProductModel } from '../data-models';
import { createProductImage, deleteProductImageFile, doesArraysHaveSimilarElements, uploadProductImageFile } from '../helpers';
import { arrayBuffer } from 'stream/consumers';


export const createProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const productImgFiles = <Array<Express.Multer.File>>req?.files;
    const productData = new CreateProductDto(req.body);

    const product = new ProductModel({
      name: productData.name,
      description: productData.description,
      quantityInStock: productData.quantityInStock
    });

    if (!Array.isArray(productImgFiles)) {
      throw new Error(`Image files not present.`);
    }

    if (productImgFiles.length > MAX_IMAGES_PER_PRODUCT) {
      throw new Error(`Maximum 3 images per product.`);
    }
    
    for (let file of productImgFiles) {
      const productImgId = await createProductImage(file, product._id, session);
      product.images?.push(productImgId);
    }

    for (let categoryName of <Array<string>>productData.categories) {
      let productCategory = await ProductCategoryModel.findOne({ name: categoryName });
      if (!productCategory) {
        productCategory = await ProductCategoryModel.create({
          name: categoryName
        });
      }
      product.categories?.push(productCategory._id);
    }

    await product.save({ session });
    await session.commitTransaction();

    for (let file of productImgFiles) {
      await uploadProductImageFile(file);
    }

    await session.endSession();
    return next(new CustomSuccess(product, 200));

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));
  }
};

export const getProducts = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel
      .find()
      .populate('images')
      .populate('categories');
    return next(new CustomSuccess(products, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const getProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel
      .findById(productId)
      .populate('images')
      .populate('categories');

    if (!product) {
      throw new Error(`Product with id ${productId} not found.`);
    }
    return next(new CustomSuccess(product, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const addNewImageOfProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const productImgFile = <Express.Multer.File>req?.file;
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);

    if (!productImgFile) {
      throw new Error(`Image not uploaded.`);
    }

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (!(<number>product.images?.length < MAX_IMAGES_PER_PRODUCT)) {
      throw new Error(`Already ${MAX_IMAGES_PER_PRODUCT} images for product present. Delete some image.`);
    }
    
    const productImgId = await createProductImage(productImgFile, product._id, session);
    product.images?.push(productImgId);

    await product.save({ session });
    await session.commitTransaction();

    await uploadProductImageFile(productImgFile);

    await session.endSession();
    return next(new CustomSuccess(product, 200));

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));
  }
};

export const deleteImageOfProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const { productId, imageId } = req.params;

    const product = await ProductModel.findById(productId);

    const image  = await ProductImageModel.findById(imageId);

    const imagePath = <string>image?.url;

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (!image) {
      throw new Error(`Image with id ${imageId} not found`);
    }

    const indexOfImage = <number>product.images?.indexOf(image._id);

    if (indexOfImage < 0) {
      throw new Error(`Image with id ${imageId} does not belong to product with id ${productId}`);
    }

    product.images?.splice(indexOfImage, 1);

    await image.deleteOne({ session });
    await product.save({ session });
    await session.commitTransaction();

    await deleteProductImageFile(imagePath);

    await session.endSession();
    return next(new CustomSuccess(product, 200));

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));
  }
};

export const rearrangeImagesOfProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const rearrangedImages: Array<string> = req.body;

    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (!(rearrangedImages &&
        Array.isArray(rearrangedImages) &&
        rearrangedImages.every(imgId => typeof imgId === 'string'))) {
      throw new Error(`Payload must be an array of strings`);
    }

    if (!doesArraysHaveSimilarElements(
      rearrangedImages,
      <Array<any>>product.images?.map(imgId => imgId.toString())
    )) {
      throw new Error(`Images are different`);
    }

    product.images = rearrangedImages.map(imgId => new Types.ObjectId(imgId));;

    await product.save();
    return next(new CustomSuccess(product, 200));

  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};
