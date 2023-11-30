import { UserRole } from '../enums';
import { AddressInterface } from './address.interface';

export interface UserInterface {
  email: string,
  password: string,
  address: AddressInterface,
  role: UserRole,
  phoneNumber: string
}
