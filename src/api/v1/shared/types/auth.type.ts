import {
  Types,
  Document
} from 'mongoose';
import {
  UserInterface
} from '../interfaces';

export type UserDocument = (Document<unknown, {}, UserInterface> & UserInterface & { _id: Types.ObjectId; });