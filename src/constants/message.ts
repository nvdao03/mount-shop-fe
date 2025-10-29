export const AUTH_MESSAGE = {
  EMAIL_INVALID: 'Email không hợp lệ',
  EMAIL_REQUIRED: 'Vui lòng nhập email',
  PASSWORD_INVALID_MIN_LENGTH: 'Mật khâu phải có ít nhẩt 6 ký tự',
  PASSWORD_INVALID_LENGTH: 'Mật khẩu phải có ít nhất 6 - 180 ký tự',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  LOGIN_FAILED: 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin',
  REGISTER_FAILED: 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin',
  REGISTER_SUCCESS: 'Đăng ký thành công, vui lòng kiểm tra email để kích hoạt tài khoản',
  FULLNAME_INVALID_MIN_LENGTH: 'Họ và tên phải có ít nhất 6 ký tự',
  FULLNAME_INVALID_LENGTH: 'Họ và tên phải có ít nhất 6 - 180 ký tự',
  FULLNAME_REQUIRED: 'Vui lòng nhập họ và tên',
  CONFIRM_PASSWORD_NOT_MATCH: 'Mật khẩu nhập lại không khớp',
  CONFIRM_PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu xác nhận',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  PHONE_INVALID_LENGTH: 'Số điện thoại tối thiểu và tối đa 10 ký tự',
  CONFIRM_PASSWORD_INVALID: 'Mật khẩu nhập lại không khớp',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khâu thành công',
  VERIFY_EMAIL_SUCCESS: 'Kích hoạt tài khoản thành công',
  RESET_PASSWORD_SUCCESS: 'Đổi mật khâu thành công',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Token không được để trống',
  ROLE_ID_REQUIRED: 'Vui lòng nhập vai trò người dùng',
  USER_NOT_VERIFIED: 'Tài khoản chưa được xác thực',
  USER_NOT_LOGGED_IN: 'Vui lòng đăng nhập'
}

export const USER_MESSAGE = {
  UPDATE_USER_SUCCESS: 'Cập nhật thông tin tài khoản thành công',
  DELETE_USER_SUCCESS: 'Xóa người dùng thành công',
  UPDATE_USER_ROLE_SUCCESS: 'Cập nhật vai trò người dùng thành công'
}

export const CATEGORY_MESSAGE = {
  CREATE_CATEGORY_SUCCESS: 'Tạo danh mục thành công',
  UPDATE_CATEGORY_SUCCESS: 'Cập nhật danh mục thành công',
  CATEGORY_NAME_REQUIRED: 'Tên danh mục không được để trống',
  CATEGORY_NAME_INVALID_LENGTH: 'Tên danh mục phải có ít nhất 2 - 180 ký tự',
  CATEGORY_IMAGE_REQUIRED: 'Hình ảnh danh mục không được để trống',
  CATEGORY_IMAGE_INVALID: 'Hình ảnh danh mục không hợp lệ',
  DELETE_CATEGORY_SUCCESS: 'Xóa danh mục thành công',
  CATEGORY_ID_REQUIRED: 'Vui lòng nhập ID danh mục'
}

export const BRAND_MESSAGE = {
  CREATE_BRAND_SUCCESS: 'Tạo thương hiệu thành công',
  UPDATE_BRAND_SUCCESS: 'Cập nhật thương hiệu thành công',
  BRAND_NAME_REQUIRED: 'Tên thương hiệu không được để trống',
  BRAND_NAME_INVALID_LENGTH: 'Tên thương hiệu phải có ít nhất 2 - 180 ký tự',
  BRAND_IMAGE_REQUIRED: 'Hình ảnh thương hiệu không được để trống',
  BRAND_IMAGE_INVALID: 'Hình ảnh thương hiệu không hợp lệ',
  DELETE_BRAND_SUCCESS: 'Xóa thương hiệu thành công'
}

export const PRODUCT_MESSAGE = {
  PRODUCT_NAME_REQUIRED: 'Tên sản phẩm không được để trống',
  PRODUCT_NAME_INVALID_LENGTH: 'Tên sản phẩm phải có ít nhất từ 2 - 180 ký tự',
  PRODUCT_IMAGE_REQUIRED: 'Hình ảnh sản phẩm không được để trống',
  PRODUCT_IMAGES_REQUIRED: 'Hình ảnh sản phẩm phụ không được để trống',
  PRODUCT_DESCRIPTION_REQUIRED: 'Thống tin chi tiết sản phẩm không được để trống',
  PRODUCT_DESCRIPTION_INVALID_LENGTH: 'Thống tin chi tiết sản phẩm phải có ít nhất từ 2 ký tự trở lên',
  PRODUCT_DISCOUNT_PRICE_REQUIRED: 'Giá sản phẩm gốc không được để trống',
  PRODUCT_PRICE_REQUIRED: 'Giá sản phẩm bán ra không được để trống',
  PRODUCT_RATING_REQUIRED: 'Số lượng sao của sản phẩm không được để trống',
  PRODUCT_SOLD_REQUIRED: 'Số lượng sản phẩm bán ra không được để trống',
  PRODUCT_STOCK_REQUIRED: 'Số lượng sản phẩm tồn kho không được để trống',
  PRODUCT_CATEGORY_ID_REQUIRED: 'Vui lòng nhập ID danh mục',
  PRODUCT_BRAND_ID_REQUIRED: 'Vui lòng nhập ID thương hiệu',
  PRODUCT_DISCOUNT_PRICE_INVALID: 'Giá sản phẩm bán ra không hợp lệ',
  PRODUCT_PRICE_INVALID: 'Giá sản phẩm không hợp lệ',
  ADD_PRODUCT_SUCCESS: 'Tạo sản phẩm thành công',
  DELETE_PRODUCT_SUCCESS: 'Xoá sản phẩm thành công',
  UPDATE_PRODUCT_SUCCESS: 'Cập nhật sản phẩm thành công',
  MIN_PRICE_GREATER_THAN_MAX_PRICE: 'Giá từ phải nhỏ hơn giá đến',
  PRODUCT_ID_REQUIRED: 'Vui lòng truyền lên ID sản phẩm',
  OUT_OF_STOCK: 'Sản phẩm đã hết hàng'
}

export const COMMET_MESSAGE = {
  COMMENT_CONTENT_REQUIRED: 'Nội dung bình luận không được để trống',
  COMMENT_CONTENT_INVALID_LENGTH: 'Nội dung bình luận phải không được vượt quá 255 ký tự',
  ADD_COMMENT_SUCCESS: 'Đã bình luận thành công',
  DELETE_COMMENT_SUCCESS: 'Xóa bình luận thành công'
}

export const ADMIN_MESSAGE = {
  LOGIN_FAILED: 'Đăng nhập quản trị thất bại, vui lòng kiểm tra lại thông tin',
  ADD_USER_SUCCESS: 'Tạo người dùng thành công'
}

export const CART_MESSAGE = {
  ADD_CART_SUCCESS: 'Thêm sản phảm vào giỏ hàng thành công',
  UPDATE_CART_SUCCESS: 'Cập nhật sản phẩm thành công',
  DELETE_CART_SUCCESS: 'Xoá sản phẩm thành công',
  CART_PRODUCT_ID_REQUIRED: 'Vui lòng truyền lên ID sản phẩm',
  CART_QUANTITY_REQUIRED: 'Vui lòng truyền lên số lượng',
  CART_EMPTY: 'Vui lòng chọn sản phẩm để thanh toán'
}

export const ADDRESS_MESSAGE = {
  FULLNAME_INVALID_MIN_LENGTH: 'Họ và tên phải có ít nhất 6 ký tự',
  FULLNAME_INVALID_LENGTH: 'Họ và tên phải có ít nhất 6 - 180 ký tự',
  FULLNAME_REQUIRED: 'Vui lòng nhập họ và tên',
  PHONE_INVALID_LENGTH: 'Số điện thoại tối thiểu và tối đa 10 ký tự',
  ADD_ADDRESS_SUCCESS: 'Thêm địa chỉ thành công'
}
