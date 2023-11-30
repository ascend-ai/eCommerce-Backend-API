import {
  NextFunction,
  Request,
  Response
} from 'express';

import { UserModel } from '../data-models';
import {
  getAccessToken,
  isPasswordValid,
  CustomError,
  CustomSuccess,
  AuthCredentialsDto
} from '../shared';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = new AuthCredentialsDto(req.body);
    const user = await UserModel.create(userData);
    next(new CustomSuccess(user, 200));
  } catch (error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!email) {
      throw new Error('Email is required');
    }
    if (!user || !(await isPasswordValid(password, user.password))) {
      throw new Error('Incorrect email or password');
    }
    const accessToken = getAccessToken({
      mongoDbUserId: user._id.toString()
    });
    next(new CustomSuccess({ accessToken }, 200));
  } catch (error: any) {
    next(new CustomError(error.message, 401));
  }
};
