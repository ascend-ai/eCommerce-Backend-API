import {
  Types,
  Document
} from 'mongoose';
import { OrderInterface } from '../interfaces';

export type OrderDocument = (Document<unknown, {}, OrderInterface> & OrderInterface & { _id: Types.ObjectId; });