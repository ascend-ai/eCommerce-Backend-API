import express from 'express';

import {
  signIn,
  signUp
} from '../controllers';

const router = express.Router();

// * UNAUTHORIZED ROUTES
router.post('/signup', signUp);
router.post('/signin', signIn);

export const authRoutes = router;
