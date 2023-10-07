import express, { NextFunction, Response } from 'express';
import { GetUserAuthInfoRequestInterface } from '../shared/interfaces';

const router = express.Router();

router.get('/', (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  
});

export const productsRoute = router;
