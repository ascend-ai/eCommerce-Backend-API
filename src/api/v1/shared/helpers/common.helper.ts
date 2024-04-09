import crypto from 'crypto';
import {
  Types
} from 'mongoose';
import {
  SORT_STRING_FORMAT
} from '../constants';
import {
  SortInfo
} from '../interfaces';
import {
  SortDirection
} from '../enums';

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

export function merge<T1 extends Object, T2 extends T1>(target: T1, source: T2): T1 {
  for (let key in target) {
    if (target.hasOwnProperty(key) &&
        source.hasOwnProperty(key) &&
        typeof target[key] === typeof source[key]) {

      if (typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])) {
        target[key] = merge<any, any>(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

export const generateHmacSha256 = (data: string, secret: string): string => {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  return hmac.digest('hex');
}

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

export const isSortStringValid = (sortString: string, sortableColumns: readonly string[]): boolean => {
  if(SORT_STRING_FORMAT.test(sortString)) {
    const sortableColumn = sortString.split(',')[0];
    return sortableColumns.includes(sortableColumn);
  } else {
    return false;
  }
}

/**
 * Use following function only if isSortStringValid returns true
 * @param sortString 
 * @returns 
 */
export const retrieveSortInfo = (sortString: string): SortInfo => {
  const [ sortColumn, sortDirection ] = <[string, SortDirection]>sortString.split(',');
  return {
    sortColumn,
    sortDirection
  }
}
