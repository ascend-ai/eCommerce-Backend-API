import {
  UserRole
} from '../enums';
import {
  AddressInterface,
  BaseModelInterface
} from './';

export interface UserInterface extends BaseModelInterface {
  email: string,
  password: string,
  address: AddressInterface,
  role: UserRole,
  phoneNumber: string,
}
