import express from 'express';


import {
  isAuthenticateUserAdminOrMod,
  isAuthenticated
} from '../shared';
import {
  createStallSchedule,
  editBasicDetailsOfStallSchedule,
  getAllStallSchedules
} from '../controllers';

const router = express.Router();

// * UNAUTHORIZED ROUTES
router.get('/', getAllStallSchedules);

// * AUTHORIZED ROUTES - CUSTOMER
router.use(isAuthenticated);

// * AUTHORIZED ROUTES - ADMIN & MODERATORS
router.use(isAuthenticateUserAdminOrMod);
router.post('/', createStallSchedule);
router.put('/:stallScheduleId/basic-details', editBasicDetailsOfStallSchedule);


export const stallScheduleRoutes = router;
