import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AccessTokenPayloadInterface } from '../shared';


export const getAccessToken = (payload: AccessTokenPayloadInterface) => {
  const { ACCESS_TOKEN_SECRET } = <Record<string, string>>process.env;
  const accessToken: string = jwt.sign(
    payload,
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: 86400
    }
  );
  return accessToken;
}

export const getHashedPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt();
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const isPasswordValid = async (givenPassword: string, hashedPassword: string): Promise<boolean> => {
  const result = await bcrypt.compare(givenPassword, hashedPassword);
  return result;
}
