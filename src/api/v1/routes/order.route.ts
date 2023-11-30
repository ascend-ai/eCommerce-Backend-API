import multer from 'multer';
import express from 'express';

import {
  createOrder,
} from '../controllers';
import {
  isAuthenticateUserAdminOrMod,
  isAuthenticated
} from '../shared';

const router = express.Router();

// * AUTHORIZED ROUTES - CUSTOMER
router.use(isAuthenticated);
router.post('/', createOrder);

// * AUTHORIZED ROUTES - ADMIN & MODERATORS
router.use(isAuthenticateUserAdminOrMod);



export const orderRoutes = router;
