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

export const schemaAdminAddUser = yup.object({
  full_name: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.FULLNAME_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.FULLNAME_INVALID_LENGTH)
    .required(AUTH_MESSAGE.FULLNAME_REQUIRED),
  email: yup.string().trim().email(AUTH_MESSAGE.EMAIL_INVALID).required(AUTH_MESSAGE.EMAIL_REQUIRED),
  password: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.PASSWORD_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.PASSWORD_INVALID_LENGTH)
    .required(AUTH_MESSAGE.PASSWORD_REQUIRED),
  role_id: yup.number().required(AUTH_MESSAGE.ROLE_ID_REQUIRED)
})

export type TypeUpdateSchemUser = yup.InferType<typeof schemaUpdateUser>
export type TypeAdminAddUser = yup.InferType<typeof schemaAdminAddUser>
