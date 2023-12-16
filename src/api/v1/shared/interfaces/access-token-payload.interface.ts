import {
  UserRole
} from '../enums';

export interface AccessTokenPayloadInterface {
  userId: string;
  userRole: UserRole
}