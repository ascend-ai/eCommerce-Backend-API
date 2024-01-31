import {
  BASE_SORTABLE_COLUMNS
} from './common.constants';

export const ACCEPTED_IMG_EXTENSIONS = ['jpeg', 'jpg', 'png'];

/**
 * Targeted image size in bytes which is 102400 bytes or 100 kilobytes
 */
export const TARGETED_IMG_SIZE = 100 * 1024;

export const MAX_IMAGES_PER_PRODUCT = 3;

export const MIN_IMAGES_PER_PRODUCT = 1;

export const PRODUCT_CATEGORY_NAME_REGEX = /^(?!_)(?!.*__)(?!.*_$)[a-z_]+$/;

export const DEFAULT_PAGINATION_PAGE = 0;

export const DEFAULT_PAGINATION_SIZE = 9;

export const MIN_QTY_IN_STOCK = 0;

export const MIN_PRODUCT_PRICE = 1;

export const PRODUCT_IMG_UPLOAD_PATH = './dist/public';

export const PRODUCT_SORTABLE_COLUMNS: readonly string[] = Object.freeze([
  ...BASE_SORTABLE_COLUMNS,
  'price',
  'totalPurchases',
]);
