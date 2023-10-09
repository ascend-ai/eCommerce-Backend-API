import { Request } from 'express';
import { Types } from 'mongoose';
import { UserInterface } from './user.interface';

export interface GetUserAuthInfoRequestInterface extends Request {
  loggedInUser?: (UserInterface & { _id: Types.ObjectId });
};