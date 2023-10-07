export class AuthCredentialsDto {
  email: string;
  password:  string;
  constructor(reqBody: Record<string, string>) {
    this.email = reqBody?.email || '';
    this.password = reqBody?.password || '';
  }
}