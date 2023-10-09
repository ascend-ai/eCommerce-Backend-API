import { UserInterface } from '../interfaces';

export class AuthCredentialsDto implements Partial<UserInterface> {
  email: string;
  password:  string;
  constructor(reqBody: Record<string, string>) {
    this.email = reqBody?.email || '';
    this.password = reqBody?.password || '';
  }
}