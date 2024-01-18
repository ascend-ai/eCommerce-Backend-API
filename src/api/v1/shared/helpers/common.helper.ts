import crypto from 'crypto';
import {
  Types
} from 'mongoose';

export const isValidJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export const isValidArrayOfStrings = (data: any): boolean => {
  return Array.isArray(data) && data.every(item => typeof item === 'string');
};

export const convertStringIdsToObjectId = (arrOfStr: Array<string>): Array<Types.ObjectId> => {
  return [...new Set((arrOfStr))]
      .map(productId => new Types.ObjectId(productId));
}

export function merge<T>(target: any, source: any): T {
  for (let key in target) {
    if (target.hasOwnProperty(key) && source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
}

export const generateHmacSha256 = (data: string, secret: string): string => {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  return hmac.digest('hex');
}

/**
 * 
 * @param arr1
 * @param arr2
 * @returns
 */
export const doesArraysHaveSimilarElements = (arr1: Array<any>, arr2: Array<any>): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) {
    return false;
  }

  for (let item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }

  return true;
};
