import multer from 'multer';

import express from 'express';
import { uploadProductImage } from '../controllers';

const router = express.Router();
const upload = multer();

router.post('/:productId/images', upload.single('product-image'), uploadProductImage);

export const productsRoute = router;
