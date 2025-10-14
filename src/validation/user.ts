import * as yup from 'yup'
import { AUTH_MESSAGE } from '../constants/message'

export const schemaUpdateUser = yup.object({
  avatar: yup.string().trim(),
  full_name: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.FULLNAME_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.FULLNAME_INVALID_LENGTH)
    .required(AUTH_MESSAGE.FULLNAME_REQUIRED),
  phone: yup.string().trim().min(10, AUTH_MESSAGE.PHONE_INVALID_LENGTH).max(10, AUTH_MESSAGE.PHONE_INVALID_LENGTH),
  address: yup.string().trim()
})

export type TypeUpdateSchemUser = yup.InferType<typeof schemaUpdateUser>
