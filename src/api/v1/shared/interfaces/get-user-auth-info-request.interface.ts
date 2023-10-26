import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { UserInterface } from './user.interface';

export interface GetUserAuthInfoRequestInterface extends Request {
  loggedInUser?: (Document & UserInterface & { _id: Types.ObjectId });
};