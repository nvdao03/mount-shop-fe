import * as yup from 'yup'
import { CART_MESSAGE } from '../constants/message'

export const schemaAddCart = yup.object({
  product_id: yup.number().required(CART_MESSAGE.CART_PRODUCT_ID_REQUIRED),
  quantity: yup.number().required(CART_MESSAGE.CART_QUANTITY_REQUIRED)
})

export type TypeSchemaAddCart = yup.InferType<typeof schemaAddCart>
