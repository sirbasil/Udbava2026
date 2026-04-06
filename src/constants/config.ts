export const APP_NAME = 'RetCom';
export const APP_TAGLINE = 'RETAIL COMMUNITY — SR UNIVERSITY';
export const APP_DESCRIPTION = 'Smart Campus Commerce & Resale Ecosystem';
export const STUDENT_EMAIL_DOMAIN = '@sru.edu.in';
export const STAFF_EMAIL_DOMAIN = '@retcom.edu';
export const CURRENCY_SYMBOL = 'RC';
export const LOYALTY_POINTS_PER_PURCHASE = 10;
export const LOYALTY_POINTS_PER_LISTING = 5;
export const CART_TIMEOUT_MINUTES = 15;
export const MIN_IMAGES_REQUIRED = 3;

export const CATEGORIES = [
  { value: 'all', label: 'All Artefacts' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'media', label: 'Media' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'lab_gear', label: 'Lab Gear' },
  { value: 'books', label: 'Books' },
  { value: 'merchandise', label: 'Merchandise' },
] as const;

export const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
] as const;

export const NAV_LINKS = [
  { label: 'EXCHANGE', path: '/exchange' },
  { label: 'DASHBOARD', path: '/dashboard' },
  { label: 'COMMUNITY', path: '/community' },
  { label: 'ARCHIVES', path: '/archives' },
];
