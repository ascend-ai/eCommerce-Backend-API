import {
  Types,
  Document
} from 'mongoose';
import {
  ProductImageInterface,
  ProductInterface
} from '../interfaces';

export type ProductDocument = (Document<unknown, {}, ProductInterface> & ProductInterface & { _id: Types.ObjectId; });

export type ProductImageDocument = (Document<unknown, {}, ProductImageInterface> & ProductImageInterface & { _id: Types.ObjectId; });
