import {
  AddressInterface,
  UserInterface
} from '../interfaces';


export class EditUserBasicDetailsDto implements Partial<UserInterface> {
  address: AddressInterface;
  phoneNumber: string;

  constructor(reqBody: Record<string, any>) {
    this.address = reqBody?.address || {};
    this.address.streetAddressLine1 = reqBody?.address?.streetAddressLine1 || '';
    this.address.streetAddressLine2 = reqBody?.address?.streetAddressLine2 || '';
    this.address.streetAddressLine3 = reqBody?.address?.streetAddressLine3 || '';
    this.address.city = reqBody?.address?.city || '';
    this.address.state = reqBody?.address?.state || '';
    this.address.country = reqBody?.address?.country || '';
    this.address.postalCode = reqBody?.address?.postalCode || null;
    this.phoneNumber = reqBody?.phoneNumber || null;
  }
}
