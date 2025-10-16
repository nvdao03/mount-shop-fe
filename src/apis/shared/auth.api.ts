import http from '../../utils/http'
import type { TypeSchemaChangePassword, TypeSchemaLogin, TypeSchemaRegister } from '../../validation/auth'

type RegisterFromData = TypeSchemaRegister
type LoginFromData = TypeSchemaLogin

export const authApi = {
  // --- auth ---
  register: (body: RegisterFromData) => http.post('/auth/register', body),
  login: (body: LoginFromData) => http.post('/auth/login', body),
  logout: (body: { refresh_token: string }) => http.post('/auth/logout', body),

  // --- change password ---
  changePassword: (body: TypeSchemaChangePassword) => http.put('/auth/change-password', body)
}
