import {
  NextFunction,
  Response
} from 'express';
import {
  CustomError,
  CustomSuccess,
  GetUserAuthInfoRequestInterface,
  UserDocument,
  UserRole
} from '../shared';
import {
  UserModel
} from '../data-models';
import {
  Types
} from 'mongoose';

export const getUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { userId }: any = req.params;
    userId = new Types.ObjectId(userId);

    const isLoggedInUserAdminOrMod: boolean =  [
      UserRole.ADMIN,
      UserRole.MODERATOR
    ].includes((<UserDocument>req.loggedInUser)?.role);

    const isLoggedInUserSelf: boolean = (<UserDocument>req.loggedInUser)?._id.equals(userId);

    if (isLoggedInUserAdminOrMod || isLoggedInUserSelf) {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      return next(new CustomSuccess(user, 200));
    } else {
      return next(new CustomError(`Unauthorized access`, 401));
    }
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};