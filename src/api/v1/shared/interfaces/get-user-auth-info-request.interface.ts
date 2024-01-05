import {
  Request
} from 'express';
import {
  UserDocument
} from '../types';

export interface GetUserAuthInfoRequestInterface extends Request {
  loggedInUser?: UserDocument;
};