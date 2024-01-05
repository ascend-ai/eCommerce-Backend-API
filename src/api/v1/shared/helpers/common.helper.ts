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
