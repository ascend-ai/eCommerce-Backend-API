import express from 'express';

import {
  createOrder,
  getAllOrders,
  verifyOrderPayment,
} from '../controllers';
import {
  isAuthenticateUserAdminOrMod,
  isAuthenticated
} from '../shared';

const router = express.Router();

// * UNAUTHORIZED ROUTES
router.post('/verify-payment', verifyOrderPayment);

// * AUTHORIZED ROUTES - CUSTOMER
router.use(isAuthenticated);
router.post('/', createOrder);

// * AUTHORIZED ROUTES - ADMIN & MODERATORS
router.use(isAuthenticateUserAdminOrMod);
router.get('/', getAllOrders);



export const orderRoutes = router;
