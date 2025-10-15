import * as yup from 'yup'
import { BRAND_MESSAGE, CATEGORY_MESSAGE } from '../constants/message'

export const schemaAddBrand = yup.object({
  name: yup
    .string()
    .trim()
    .required(BRAND_MESSAGE.BRAND_NAME_REQUIRED)
    .min(2, BRAND_MESSAGE.BRAND_NAME_INVALID_LENGTH)
    .max(180, BRAND_MESSAGE.BRAND_NAME_INVALID_LENGTH),
  image: yup.string().trim().required(BRAND_MESSAGE.BRAND_IMAGE_REQUIRED),
  category_id: yup.number().required(CATEGORY_MESSAGE.CATEGORY_ID_REQUIRED)
})

export type TypeSchemaAddBrand = yup.InferType<typeof schemaAddBrand>
