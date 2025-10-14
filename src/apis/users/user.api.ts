import type { GetUserProfileResponseSuccess } from '../../types/user.type'
import http from '../../utils/http'
import type { TypeUpdateSchemUser } from '../../validation/user'

type FormDataUpdateProfile = TypeUpdateSchemUser

export const userApi = {
  // --- Get User Profile ---
  getProfile: () => http.get<GetUserProfileResponseSuccess>('/user/profile'),
  // --- Update User Profile ---
  updateProfile: (body: FormDataUpdateProfile) => http.put('/user/profile', body)
}
