import { NextFunction, Response } from 'express';
import { CreateProductDto, CustomError, CustomSuccess, GetUserAuthInfoRequestInterface, MAX_IMAGES_PER_PRODUCT, ProductCategoryInterface } from '../shared';
import mongoose, { ClientSession } from 'mongoose';
import { ProductCategoryModel, ProductModel } from '../data-models';
import { createProductImage, uploadProductImageFile } from '../helpers';


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
