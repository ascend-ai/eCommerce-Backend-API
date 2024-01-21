import express from 'express';
import {
  isAuthenticateUserStrictlyAdmin,
  isAuthenticateUserAdminOrMod,
  isAuthenticated
} from '../shared';
import {
  getModeratorList,
  getOrderSpecificToUser,
  getOrdersSpecificToUser,
  getUser,
  getUsers,
  updateModerators
} from '../controllers';

const router = express.Router();

router.get(
  '/',
  isAuthenticated,
  isAuthenticateUserAdminOrMod,
  getUsers
);

router.get(
  '/moderators',
  isAuthenticated,
  isAuthenticateUserAdminOrMod,
  getModeratorList
);

router.get(
  '/:userId',
  isAuthenticated,
  getUser
);

router.get(
  '/:userId/orders',
  isAuthenticated,
  getOrdersSpecificToUser
);

router.get(
  '/:userId/orders/:orderId',
  isAuthenticated,
  getOrderSpecificToUser
);

router.put(
  '/moderators',
  isAuthenticated,
  isAuthenticateUserStrictlyAdmin,
  updateModerators
);

export const userRoutes = router;
