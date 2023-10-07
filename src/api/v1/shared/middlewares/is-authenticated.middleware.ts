import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserDataModel } from '../../data-models';
import { GetUserAuthInfoRequestInterface, AccessTokenPayloadInterface } from '../interfaces';
import { CustomError } from '../utility-classes';

export const isAuthenticated = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req?.headers?.authorization;
  const { ACCESS_TOKEN_SECRET } = process.env;
  if (accessToken) {
    try {
      const embeddedPayloadFromJwt = <AccessTokenPayloadInterface>jwt.verify(
        accessToken,
        <string>ACCESS_TOKEN_SECRET,
      );
      const loggedInUserId = embeddedPayloadFromJwt?.mongoDbUserId;
      if (loggedInUserId) {
        const user = await UserDataModel.findById(loggedInUserId);
        if (user) {
          // * Adding custom property to req
          req.loggedInUser = user;
          next();
        } else {
          throw new Error(`Unauthorized access`);
        }
      } else {
        throw new Error(`Unauthorized access`);
      }
    } catch(error: any) {
      next(new CustomError(error.message, 401));
    }
  } else {
    next(new CustomError('Unauthorized access', 401));
  }
};