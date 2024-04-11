import {
  Types,
  Document
} from 'mongoose';
import {
  StallScheduleInterface
} from '../interfaces';

export type StallScheduleDocument = (Document<unknown, {}, StallScheduleInterface> & StallScheduleInterface & { _id: Types.ObjectId; });