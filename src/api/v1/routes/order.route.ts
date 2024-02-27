import express from 'express';

import {
  createOrder,
  editBasicDetailsOfOrder,
  getAllOrders,
  getOrder,
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
router.get('/:orderId', getOrder);

// * AUTHORIZED ROUTES - ADMIN & MODERATORS
router.use(isAuthenticateUserAdminOrMod);
router.get('/', getAllOrders);
router.put('/:orderId/basic-details', editBasicDetailsOfOrder);



export const orderRoutes = router;
