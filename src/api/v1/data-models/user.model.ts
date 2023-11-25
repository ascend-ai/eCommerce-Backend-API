import mongoose, { CallbackWithoutResultAndOptionalError } from 'mongoose';
import { getHashedPassword } from '../shared';
import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_NUMBER_REGEX, UserInterface, UserRole } from '../shared';

const userSchema = new mongoose.Schema<UserInterface>({
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
  address: {
    streetAddressLine1: {
      type: String,
      required: true,
    },
    streetAddressLine2: String,
    streetAddressLine3: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true
    },
  },
  role: {
    type: String,
    enum: [
      UserRole.ADMIN,
      UserRole.MODERATOR,
      UserRole.CUSTOMER
    ],
    default: UserRole.CUSTOMER
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    match: [PHONE_NUMBER_REGEX, 'Phone number invalid']
  }
});

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

export const UserModel = mongoose.model<UserInterface>('User', userSchema);
