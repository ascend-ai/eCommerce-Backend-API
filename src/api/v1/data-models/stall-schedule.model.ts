import mongoose, {
  CallbackWithoutResultAndOptionalError
} from 'mongoose';
import {
  STALL_SCHEDULE_VENUE_LENGTH_RANGE,
  StallScheduleInterface
} from '../shared';

const stallScheduleSchema = new mongoose.Schema<StallScheduleInterface>({
  venue: {
    type: String,
    minlength: STALL_SCHEDULE_VENUE_LENGTH_RANGE.MIN
  },
  date: {
    type: Number,
    required: true,
    validate: function(this: StallScheduleInterface) {
      return this.date > Date.now();
    }
  },
  openingTime: {
    type: Number,
    required: true,
    validate: function(this: StallScheduleInterface) {
      return (this.openingTime < this.closingTime) &&
             (this.openingTime >= Date.now());
    }
  },
  closingTime: {
    type: Number,
    required: true,
  },
  whenCreated: {
    type: Number,
    default: Date.now
  },
  whenLastUpdated: {
    type: Number,
    default: Date.now
  }
});

stallScheduleSchema.pre('updateOne', { document: true, query: false }, function (next: CallbackWithoutResultAndOptionalError) {
  this.whenLastUpdated = Date.now();
  next();
});

export const StallScheduleModel = mongoose.model<StallScheduleInterface>('StallSchedule', stallScheduleSchema);