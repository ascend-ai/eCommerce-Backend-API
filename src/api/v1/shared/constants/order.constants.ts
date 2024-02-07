import {
  BASE_SORTABLE_COLUMNS
} from './common.constants';

export const ACCEPTED_CURRENCY = 'INR';

export const MIN_ORDERABLE_PRODUCT_QTY = 1;


/**
 * Minimum purchase amount for no shipping charge.
 */
export const NO_SHIPPING_CHARGE_THRESHOLD = 700;

export const SHIPPING_CHARGE = 80;

/**
 * INR 1 = 100 paise
 */
export const INR_SUBUNIT = 100;

/**
 * 1 hr (In milliseconds)
 */
export const PENDING_ORDER_DELETION_DELAY = 60 * 60 * 1000;

export const ORDER_SORTABLE_COLUMNS: readonly string[] = Object.freeze([
  ...BASE_SORTABLE_COLUMNS,
  'totalAmount',
]);

