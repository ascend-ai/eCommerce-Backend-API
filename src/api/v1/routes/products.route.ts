import multer from 'multer';

import express from 'express';
import { createProduct, getProduct, getProducts } from '../controllers';
import { isAuthenticateUserAdminOrMod, isAuthenticated } from '../shared';

const router = express.Router();
const upload = multer();

// * UNAUTHORIZED ROUTES
router.get('/', getProducts);
router.get('/:productId', getProduct);

// * AUTHORIZED ROUTES - CUSTOMER
router.use(isAuthenticated);

// * AUTHORIZED ROUTES - ADMIN & MODERATORS
router.use(isAuthenticateUserAdminOrMod);
router.post('/', upload.array('product-images'), createProduct);


export const productsRoute = router;
