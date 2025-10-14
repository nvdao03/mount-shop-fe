import type { UseMutationResult } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

// --- Get Username From Email ---
export const getUsernameFromEmail = (email: string) => email.split('@')[0]

// --- Handle File Upload --- //
export const handleUploadImageHelper = (
  mutation: UseMutationResult<AxiosResponse<any, any, {}>, unknown, FormData, unknown>,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.target.files
  if (files && files.length > 0) {
    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append('image', file)
    })
    mutation.mutate(formData)
  }
}
