export const PATH = {
  // --- Auth ---
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',

  // --- Shop (public pages) ---
  HOME: '/',

  // --- User  ---
  USER_PROFILE: '/profile',
  USER_FORGOT_PASSWORD: '/forgot-password',

  // --- Admin ---
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ADD_CATEGORY: '/admin/categories/add-category',
  ADMIN_UPDATE_CATEGORY: '/admin/categories/update-category/:category_id',

  ADMIN_BRANDS: '/admin/brands',
  ADMIN_ADD_BRAND: '/admin/brands/add-brand',
  ADMIN_UPDATE_BRAND: '/admin/brands/update-brand/:brand_id',

  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_VOUCHERS: '/admin/vouchers',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_COMMENTS: '/admin/comments'
}
