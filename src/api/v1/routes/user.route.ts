import express from 'express';

import {
  isAuthenticateUserAdminOrMod,
  isAuthenticated
} from '../shared';
import {
  getOrderSpecificToUser,
  getOrdersSpecificToUser,
  getUser
} from '../controllers';

const router = express.Router();

// * UNAUTHORIZED ROUTES

// * AUTHORIZED ROUTES - CUSTOMER
router.use(isAuthenticated);
router.get('/:userId', getUser);
router.get('/:userId/orders', getOrdersSpecificToUser);
router.get('/:userId/orders/:orderId', getOrderSpecificToUser);

// * AUTHORIZED ROUTES - ADMIN & MODERATORS
router.use(isAuthenticateUserAdminOrMod);



export const userRoutes = router;
