import * as yup from 'yup'
import { PRODUCT_MESSAGE } from '../constants/message'

export const schemaAddProduct = yup.object({
  name: yup
    .string()
    .trim()
    .required(PRODUCT_MESSAGE.PRODUCT_NAME_REQUIRED)
    .min(2, PRODUCT_MESSAGE.PRODUCT_NAME_INVALID_LENGTH)
    .max(180, PRODUCT_MESSAGE.PRODUCT_NAME_INVALID_LENGTH),
  description: yup
    .string()
    .trim()
    .required(PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_REQUIRED)
    .min(2, PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_INVALID_LENGTH),
  price_before_discount: yup
    .number()
    .required(PRODUCT_MESSAGE.PRODUCT_DISCOUNT_PRICE_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_DISCOUNT_PRICE_REQUIRED),
  price: yup
    .number()
    .required(PRODUCT_MESSAGE.PRODUCT_PRICE_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_PRICE_REQUIRED)
    .test('price', PRODUCT_MESSAGE.PRODUCT_PRICE_INVALID, function (value) {
      if (this.parent.price_before_discount === 0) {
        return true
      } else if (value > this.parent.price_before_discount) {
        return false
      }
      return true
    }),
  rating: yup
    .string()
    .required(PRODUCT_MESSAGE.PRODUCT_RATING_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_RATING_REQUIRED),
  sold: yup.number().required(PRODUCT_MESSAGE.PRODUCT_SOLD_REQUIRED).typeError(PRODUCT_MESSAGE.PRODUCT_SOLD_REQUIRED),
  stock: yup
    .number()
    .required(PRODUCT_MESSAGE.PRODUCT_STOCK_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_STOCK_REQUIRED),
  category_id: yup.number().required(PRODUCT_MESSAGE.PRODUCT_CATEGORY_ID_REQUIRED),
  brand_id: yup.number().required(PRODUCT_MESSAGE.PRODUCT_BRAND_ID_REQUIRED)
})

export const schemaUpdateProduct = yup.object({
  name: yup
    .string()
    .trim()
    .required(PRODUCT_MESSAGE.PRODUCT_NAME_REQUIRED)
    .min(2, PRODUCT_MESSAGE.PRODUCT_NAME_INVALID_LENGTH)
    .max(180, PRODUCT_MESSAGE.PRODUCT_NAME_INVALID_LENGTH),
  description: yup
    .string()
    .trim()
    .required(PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_REQUIRED)
    .min(2, PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_INVALID_LENGTH),
  price_before_discount: yup
    .number()
    .required(PRODUCT_MESSAGE.PRODUCT_DISCOUNT_PRICE_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_DISCOUNT_PRICE_REQUIRED),
  price: yup
    .number()
    .required(PRODUCT_MESSAGE.PRODUCT_PRICE_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_PRICE_REQUIRED)
    .test('price', PRODUCT_MESSAGE.PRODUCT_PRICE_INVALID, function (value) {
      if (this.parent.price_before_discount === 0) {
        return true
      } else if (value > this.parent.price_before_discount) {
        return false
      }
      return true
    }),
  rating: yup
    .string()
    .required(PRODUCT_MESSAGE.PRODUCT_RATING_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_RATING_REQUIRED),
  sold: yup.number().required(PRODUCT_MESSAGE.PRODUCT_SOLD_REQUIRED).typeError(PRODUCT_MESSAGE.PRODUCT_SOLD_REQUIRED),
  stock: yup
    .number()
    .required(PRODUCT_MESSAGE.PRODUCT_STOCK_REQUIRED)
    .typeError(PRODUCT_MESSAGE.PRODUCT_STOCK_REQUIRED),
  category_id: yup.number().required(PRODUCT_MESSAGE.PRODUCT_CATEGORY_ID_REQUIRED),
  brand_id: yup.number().required(PRODUCT_MESSAGE.PRODUCT_BRAND_ID_REQUIRED)
})

export type TypeSchemaAddProduct = yup.InferType<typeof schemaAddProduct>
export type TypeSchemaUpdateProduct = yup.InferType<typeof schemaUpdateProduct>
