import * as yup from 'yup'
import { COMMET_MESSAGE } from '../constants/message'

export const schemaAddComment = yup.object({
  content: yup
    .string()
    .trim()
    .required(COMMET_MESSAGE.COMMENT_CONTENT_REQUIRED)
    .max(255, COMMET_MESSAGE.COMMENT_CONTENT_INVALID_LENGTH)
})

export type TypeSChemaAddComment = yup.InferType<typeof schemaAddComment>
