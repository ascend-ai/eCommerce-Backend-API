import express from 'express';
import { signIn, signUp } from '../controllers';

const router = express.Router();

router.post('/signup', signUp);

router.post('/signin', signIn);

export const authRoute = router;
