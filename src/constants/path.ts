export const PATH = {
  // --- Auth ---
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_FORGOT_PASSWORD: '/verify-forgot-password',
  RESET_PASSWORD: '/reset-password',
  PRODUCT_DETAIL: '/product-detail/:product_id',

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

  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ADD_PRODUCT: '/admin/products/add-product',
  ADMIN_UPDATE_PRODUCT: '/admin/products/update-product/:product_id',
  ADMIN_PRODUCT_DETAIL: '/admin/products/product-detail/:product_id',

  ADMIN_USERS: '/admin/users',
  ADMIN_VOUCHERS: '/admin/vouchers',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_COMMENTS: '/admin/comments'
}
