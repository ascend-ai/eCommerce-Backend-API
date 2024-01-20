import {
  NextFunction,
  Response
} from 'express';
import mongoose, { ClientSession, FilterQuery, Types } from 'mongoose';

import {
  CreateProductDto,
  CustomError,
  CustomSuccess,
  GetUserAuthInfoRequestInterface,
  MAX_IMAGES_PER_PRODUCT,
  Pagination,
  convertStringIdsToObjectId,
  isValidArrayOfStrings,
  createProductImage,
  deleteProductImageFile,
  doesArraysHaveSimilarElements,
  uploadProductImageFile,
  ProductInterface,
  EditProductBasicDetailsDto,
  merge,
  ProductDocument,
  MIN_IMAGES_PER_PRODUCT,
  ProductImageDocument,
  ProductFilterCriteriaDto
} from '../shared';
import {
  ProductImageModel,
  ProductModel
} from '../data-models';


export const createProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const productImgFiles = <Array<Express.Multer.File>>req?.files;
    const productData = new CreateProductDto(req.body);

    const product = new ProductModel({
      name: productData.name,
      description: productData.description,
      quantityInStock: productData.quantityInStock,
      category: productData.category,
      isPopular: productData.isPopular,
      price: productData.price,
    });

    if (!Array.isArray(productImgFiles) ||
        productImgFiles.length < MIN_IMAGES_PER_PRODUCT) {
      throw new Error(`Minimum 1 image per product req`);
    }

    if (productImgFiles.length > MAX_IMAGES_PER_PRODUCT) {
      throw new Error(`Maximum 3 images per product.`);
    }
    
    for (let file of productImgFiles) {
      const productImgId = await createProductImage(file, product._id, session);
      (product.images as unknown as Array<ProductImageDocument>)?.push(productImgId);
    }

    for (let productId of <Array<Types.ObjectId>>productData.similarProducts) {
      const similarProduct = await ProductModel.findById(productId);
      if (!similarProduct) {
        throw new Error(`Product with id ${productId} from similar product array not found`);
      }
      product.similarProducts.push(productId);
      similarProduct.similarProducts.push(product._id);
      await similarProduct.save({ session });
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
    const {
      page,
      size,
      category,
      isPopular,
      search
    } = new ProductFilterCriteriaDto(req.query);

    const filterQueryList: Array<FilterQuery<ProductInterface>> = [];

    if (category) {
      filterQueryList.push({ category });
    }

    if (typeof isPopular === 'boolean') {
      filterQueryList.push({ isPopular });
    }

    if (typeof search === 'string' && search.length > 0) {
      filterQueryList.push({ name: { $regex: search, $options: 'i' } });
    }


    let totalElements: number;
    let totalPages: number;
    let products;

    if (filterQueryList.length > 0) {
      totalElements = await ProductModel.countDocuments({
        $and: filterQueryList
      });
  
      totalPages = Math.floor(totalElements / size);
      if ((totalElements % size) > 0) {
        totalPages += 1;
      }
  
      products = await ProductModel
        .find({
          $and: filterQueryList
        })
        .skip(page * size)
        .limit(size)
        .populate('images');
    } else {
      totalElements = await ProductModel.countDocuments();
  
      totalPages = Math.floor(totalElements / size);
      if ((totalElements % size) > 0) {
        totalPages += 1;
      }
  
      products = await ProductModel
        .find()
        .skip(page * size)
        .limit(size)
        .populate('images');
    }

    const pagination = new Pagination(
      products,
      totalElements,
      totalPages,
      page,
      size
    );

    return next(new CustomSuccess(pagination, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const getProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel
      .findById(productId)
      .populate('images');

    if (!product) {
      throw new Error(`Product with id ${productId} not found.`);
    }
    return next(new CustomSuccess(product, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const getProductsWithIds = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {

    if (!req.body) {
      throw new Error(`Array of product ids not present`);
    }

    if (!isValidArrayOfStrings(req.body)) {
      throw new Error(`Invalid array of product ids`)
    }
    const productIds = convertStringIdsToObjectId(req.body);

    const products: Array<any> = [];

    for (let productId of productIds) {
      const product = await ProductModel.findById(productId)
        .populate('images');

      if (!product) {
        throw new Error(`Product with id ${productId} doesn't exist`);
      }

      products.push(product);
    }

    
    return next(new CustomSuccess(products, 200));
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

    const product = await ProductModel
      .findById(productId)
      .populate('images');


    if (!productImgFile) {
      throw new Error(`Image not uploaded.`);
    }

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (!(<number>product.images?.length < MAX_IMAGES_PER_PRODUCT)) {
      throw new Error(`Already ${MAX_IMAGES_PER_PRODUCT} images for product present. Delete some image.`);
    }

    
    const productImg = await createProductImage(productImgFile, product._id, session);
    (product.images as unknown as Array<ProductImageDocument>)?.push(productImg);

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

    const product = await ProductModel
      .findById(productId)
      .populate('images');

    const image  = await ProductImageModel.findById(imageId);

    const imagePath = <string>image?.url;

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (!image) {
      throw new Error(`Image with id ${imageId} not found`);
    }

    const indexOfImage = product.images.findIndex(item => {
      return item._id.equals(image._id);
    });

    if (indexOfImage < 0) {
      throw new Error(`Image with id ${imageId} does not belong to product with id ${productId}`);
    }

    if (product.images.length === MIN_IMAGES_PER_PRODUCT) {
      throw new Error(`Minimum image limit reached`);
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

    const product = await ProductModel
      .findById(productId)
      .populate('images');

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
      <Array<any>>product.images?.map(img => img._id.toString())
    )) {
      throw new Error(`Images are different`);
    }

    
    product.images = rearrangedImages
      .map(imgId => <Types.ObjectId>product.images.find(img => img._id.equals(new Types.ObjectId(imgId))));

    await product.save();
    return next(new CustomSuccess(product, 200));

  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const editBasicDetailsOfProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    let product: ProductDocument | null = await ProductModel
      .findById(productId)
      .populate('images');

    if (!product) {
      throw new Error(`Product with id ${productId} not found.`);
    }

    const basicDetails = new EditProductBasicDetailsDto(product);
    const newBasicDetails = merge<EditProductBasicDetailsDto>(basicDetails, req.body);

    product.name = newBasicDetails.name;
    product.description = newBasicDetails.description;
    product.quantityInStock = newBasicDetails.quantityInStock;
    product.category = newBasicDetails.category;
    product.isPopular = newBasicDetails.isPopular;
    product.price = newBasicDetails.price;

    await product.save();
    return next(new CustomSuccess(product, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const editSimilarProductsOfProduct = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const { productId } = req.params;

    if (!req.body) {
      throw new Error(`Array of new similar products not present`);
    }

    if (!isValidArrayOfStrings(req.body)) {
      throw new Error(`Invalid array of new similar products`)
    }
    const newSimilarProductList = convertStringIdsToObjectId(req.body);

    const product = await ProductModel
      .findById(productId)
      .populate('images');

    if (!product) {
      throw new Error(`Product with id ${productId} not found.`);
    }

    const removeSimilarProductIds = product.similarProducts.filter(oldProductId => {
      return !newSimilarProductList.some(newProductId => newProductId.equals(oldProductId));
    });

    const addSimilarProductIds = newSimilarProductList.filter(newProductId => {
      return !product.similarProducts.some(oldProductId => oldProductId.equals(newProductId));
    });

    for (let productId of removeSimilarProductIds) {
      const oldSimilarProduct = await ProductModel.findById(productId);
      if (oldSimilarProduct) {
        product.similarProducts = product.similarProducts.filter(id => !id.equals(productId));
        oldSimilarProduct.similarProducts = oldSimilarProduct.similarProducts.filter(id => !id.equals(product._id));
        await oldSimilarProduct?.save({ session });
      }
    }

    for (let productId of addSimilarProductIds) {
      if (product._id.equals(productId)) {
        throw new Error(`Cannot add product itself as a similar product`);
      }
      const newSimilarProduct = await ProductModel.findById(productId);
      if (!newSimilarProduct) {
        throw new Error(`Product with id ${productId} from similar product array not found`);
      }
      product.similarProducts.push(productId);
      newSimilarProduct.similarProducts.push(product._id);
      await newSimilarProduct.save({ session });
    }

    await product.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return next(new CustomSuccess(product, 200));
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 500));
  }
};
