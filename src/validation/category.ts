import * as yup from 'yup'
import { CATEGORY_MESSAGE } from '../constants/message'

export const schemaAddCategory = yup.object({
  name: yup
    .string()
    .trim()
    .required(CATEGORY_MESSAGE.CATEGORY_NAME_REQUIRED)
    .min(2, CATEGORY_MESSAGE.CATEGORY_NAME_INVALID_LENGTH)
    .max(180, CATEGORY_MESSAGE.CATEGORY_NAME_INVALID_LENGTH),
  image: yup.string().trim().required(CATEGORY_MESSAGE.CATEGORY_IMAGE_REQUIRED)
})

export const schemaUpdateCategory = yup.object({
  name: yup
    .string()
    .trim()
    .required(CATEGORY_MESSAGE.CATEGORY_NAME_REQUIRED)
    .min(2, CATEGORY_MESSAGE.CATEGORY_NAME_INVALID_LENGTH)
    .max(180, CATEGORY_MESSAGE.CATEGORY_NAME_INVALID_LENGTH),
  image: yup.string().trim().required(CATEGORY_MESSAGE.CATEGORY_IMAGE_REQUIRED)
})

export type TypeSchemaAddCategory = yup.InferType<typeof schemaAddCategory>
export type TypeSchemaUpdateCategory = yup.InferType<typeof schemaUpdateCategory>
