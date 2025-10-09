import http from '../../utils/http'
import type { TypeSchemaLogin, TypeSchemaRegister } from '../../utils/validation'

type RegisterFromData = TypeSchemaRegister
type LoginFromData = TypeSchemaLogin

export const authApi = {
  // --- auth ---
  register: (body: RegisterFromData) => http.post('/auth/register', body),
  login: (body: LoginFromData) => http.post('/auth/login', body),
  logout: (body: { refresh_token: string }) => http.post('/auth/logout', body)
}
