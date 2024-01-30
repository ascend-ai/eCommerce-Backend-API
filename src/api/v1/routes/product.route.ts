import multer from 'multer';
import express from 'express';

import {
  addNewImageOfProduct,
  createProduct,
  deleteImageOfProduct,
  getProduct,
  getProducts,
  rearrangeImagesOfProduct,
  editSimilarProductsOfProduct,
  getProductsWithIds,
  editBasicDetailsOfProduct,
} from '../controllers';
import {
  isAuthenticateUserAdminOrMod,
  isAuthenticated
} from '../shared';

const router = express.Router();
const upload = multer();

// * UNAUTHORIZED ROUTES
router.get('/', getProducts);
router.get('/:productId', getProduct);
router.post('/with-ids', getProductsWithIds);

// * AUTHORIZED ROUTES - CUSTOMER
router.use(isAuthenticated);

// * AUTHORIZED ROUTES - ADMIN & MODERATORS
router.use(isAuthenticateUserAdminOrMod);
router.post('/', upload.array('product-images'), createProduct);
router.post('/:productId/images', upload.single('product-image'), addNewImageOfProduct);
router.put('/:productId/images', rearrangeImagesOfProduct);
router.put('/:productId/basic-details', editBasicDetailsOfProduct);
router.put('/:productId/similar-products', editSimilarProductsOfProduct);
router.delete('/:productId/images/:imageId', deleteImageOfProduct);

export const productRoutes = router;
