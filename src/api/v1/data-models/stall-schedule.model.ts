import mongoose, {
  CallbackWithoutResultAndOptionalError
} from 'mongoose';
import {
  StallScheduleInterface
} from '../shared';

const stallScheduleSchema = new mongoose.Schema<StallScheduleInterface>({
  venue: {
    type: String,
    minlength: 5
  },
  date: {
    type: Number,
    required: true,
    validate: {
      validator: function(this: StallScheduleInterface) {
        const givenDate: number = new Date(this.date).getDate();
        const givenMonth: number = new Date(this.date).getMonth();
        const givenYear: number = new Date(this.date).getFullYear();
        const currentDate: number = new Date().getDate();
        const currentMonth: number = new Date().getMonth();
        const currentYear: number = new Date().getFullYear();
        return (givenDate >= currentDate) &&
               (givenMonth >= currentMonth) &&
               (givenYear >= currentYear)
      },
      message: `Date cannot be less than ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
    }
  },
  openingTime: {
    type: Number,
    required: true,
    validate: {
      validator: function(this: StallScheduleInterface) {
        const givenDate: number = new Date(this.openingTime).getDate();
        const givenMonth: number = new Date(this.openingTime).getMonth();
        const givenYear: number = new Date(this.openingTime).getFullYear();
        const currentDate: number = new Date().getDate();
        const currentMonth: number = new Date().getMonth();
        const currentYear: number = new Date().getFullYear();
        return (this.openingTime < this.closingTime) &&
               (givenDate >= currentDate) &&
               (givenMonth >= currentMonth) &&
               (givenYear >= currentYear);
      },
      message: `Opening time cannot be greater than closing time & it cannot be less that ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}, 00:00AM`
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