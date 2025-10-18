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

// Chuyển đổi dạng tiền
export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

// Chuyển đổi số lượng đã bán
export function fomatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
}
