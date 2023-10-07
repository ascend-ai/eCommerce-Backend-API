import { NextFunction, Request, Response } from 'express';
import { UserDataModel } from '../data-models';
import { getAccessToken, isPasswordValid } from '../helpers';
import { CustomError, CustomSuccess } from '../shared/utility-classes';
import { AuthCredentialsDto } from '../shared/data-transfer-objects';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = new AuthCredentialsDto(req.body);
    const userDocument = await UserDataModel.create(userData);
    next(new CustomSuccess(userDocument, 200));
  } catch (error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userDocument = await UserDataModel.findOne({ email });
    if (!email) {
      throw new Error('Email is required');
    }
    if (!userDocument || !(await isPasswordValid(password, userDocument.password))) {
      throw new Error('Incorrect email or password');
    }
    const accessToken = getAccessToken({
      mongoDbUserId: userDocument._id.toString()
    });
    next(new CustomSuccess({ accessToken }, 200));
  } catch (error: any) {
    next(new CustomError(error.message, 401));
  }
};
