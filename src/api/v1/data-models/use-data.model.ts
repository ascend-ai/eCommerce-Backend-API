import mongoose, { CallbackWithoutResultAndOptionalError } from 'mongoose';
import { getHashedPassword } from '../helpers';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../shared/constants';

export interface UserDataInterface {
  email: string,
  password: string
}

// User schema
const userSchema = new mongoose.Schema<UserDataInterface>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [EMAIL_REGEX, 'Email must follow the regex pattern'],
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash and save password
userSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) {
    next();
  }

  if (!PASSWORD_REGEX.test(this.password)) {
    next(new Error(`Password must follow the regex pattern`));
  }

  try {
    this.password = await getHashedPassword(this.password);
    next();
  } catch (error: any) {
    next(error);
  }
});

// User model
export const UserDataModel = mongoose.model<UserDataInterface>('Users', userSchema);
