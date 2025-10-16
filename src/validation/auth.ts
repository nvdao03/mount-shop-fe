import * as yup from 'yup'
import { AUTH_MESSAGE } from '../constants/message'

export const schemaLogin = yup.object({
  email: yup.string().trim().email(AUTH_MESSAGE.EMAIL_INVALID).required(AUTH_MESSAGE.EMAIL_REQUIRED),
  password: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.PASSWORD_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.PASSWORD_INVALID_LENGTH)
    .required(AUTH_MESSAGE.PASSWORD_REQUIRED)
})

export const schemaRegister = yup.object({
  email: yup.string().trim().email(AUTH_MESSAGE.EMAIL_INVALID).required(AUTH_MESSAGE.EMAIL_REQUIRED),
  full_name: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.FULLNAME_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.FULLNAME_INVALID_LENGTH)
    .required(AUTH_MESSAGE.FULLNAME_REQUIRED),
  password: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.PASSWORD_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.PASSWORD_INVALID_LENGTH)
    .required(AUTH_MESSAGE.PASSWORD_REQUIRED),
  confirm_password: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.PASSWORD_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.PASSWORD_INVALID_LENGTH)
    .oneOf([yup.ref('password')], AUTH_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
    .required(AUTH_MESSAGE.CONFIRM_PASSWORD_REQUIRED)
})

export const schemaChangePassword = yup.object({
  current_password: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.PASSWORD_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.PASSWORD_INVALID_LENGTH)
    .required(AUTH_MESSAGE.PASSWORD_REQUIRED),
  new_password: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.PASSWORD_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.PASSWORD_INVALID_LENGTH)
    .required(AUTH_MESSAGE.PASSWORD_REQUIRED),
  confirm_password: yup
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.PASSWORD_INVALID_MIN_LENGTH)
    .max(180, AUTH_MESSAGE.PASSWORD_INVALID_LENGTH)
    .required(AUTH_MESSAGE.PASSWORD_REQUIRED)
    .oneOf([yup.ref('new_password')], AUTH_MESSAGE.CONFIRM_PASSWORD_INVALID)
})

export type TypeSchemaLogin = yup.InferType<typeof schemaLogin>
export type TypeSchemaRegister = yup.InferType<typeof schemaRegister>
export type TypeSchemaChangePassword = yup.InferType<typeof schemaChangePassword>
