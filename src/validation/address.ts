import * as yup from 'yup'
import { ADDRESS_MESSAGE } from '../constants/message'

export const schemaAddAddress = yup.object({
  full_name: yup
    .string()
    .trim()
    .min(6, ADDRESS_MESSAGE.FULLNAME_INVALID_MIN_LENGTH)
    .max(180, ADDRESS_MESSAGE.FULLNAME_INVALID_LENGTH)
    .required(ADDRESS_MESSAGE.FULLNAME_REQUIRED),
  phone: yup
    .string()
    .trim()
    .min(10, ADDRESS_MESSAGE.PHONE_INVALID_LENGTH)
    .max(10, ADDRESS_MESSAGE.PHONE_INVALID_LENGTH),
  address: yup.string().trim()
})

export type TypeSchemaAddAddress = yup.InferType<typeof schemaAddAddress>
