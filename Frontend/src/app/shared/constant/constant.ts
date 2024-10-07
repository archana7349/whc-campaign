export const OTP_INTERVAL: number = 60;
export const REDIRECT_INTERVAL: number = 10;
export const AUTH_DETAILS: String = 'authDetails';
export const TOKEN: String = 'token';
export const ADMIN: String = 'vg_admin';
export const FORM_DATA: string = 'tempFormData';
export const PAGE_LIMIT: number = 2;
export const ITEMS_PER_PAGE: number = 1;
export const SKIP_PAGE: number = 1;

export const TAC_URL:string = "https://rishta-uat.s3.ap-south-1.amazonaws.com/img/dhanbarse_terms_condition.pdf"
export const MAX_FILE_SIZE:number = 5 * 1024 * 1024
export function calculateItems(items_per_page: number, page_index: number) {
  return items_per_page * page_index + items_per_page;
}

export function isPageReachedLimit(
  calculated_items: number,
  dataSourceLength: number
) {
  if (calculated_items > dataSourceLength) return true;
  else return false;
}

export function validCouponCode(coupon: string) {
  const pattern = /^\d{16}$/;
  return pattern.test(coupon);
}

export function validPincode(input: string) {
  const regex = /^\d{6}$/;
  return regex.test(input);
}

export function validEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
