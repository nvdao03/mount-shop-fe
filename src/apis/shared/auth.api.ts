import http from '../../utils/http'
import type {
  TypeSchemaChangePassword,
  TypeSchemaForgotPassword,
  TypeSchemaLogin,
  TypeSchemaRegister
} from '../../validation/auth'

type RegisterFromData = TypeSchemaRegister
type LoginFromData = TypeSchemaLogin

export const authApi = {
  // --- auth ---
  register: (body: RegisterFromData) => http.post('/auth/register', body),
  login: (body: LoginFromData) => http.post('/auth/login', body),
  logout: (body: { refresh_token: string }) => http.post('/auth/logout', body),

  // --- change password ---
  changePassword: (body: TypeSchemaChangePassword) => http.put('/auth/change-password', body),

  // --- Vefiy Email ---
  verifyEmail: (body: { email_verify_token: string }) => http.post('/auth/verify-email', body),

  // --- Forgot Password ---
  forgotPassword: (body: TypeSchemaForgotPassword) => http.post('/auth/forgot-password', body),
  verifyForgotPasswodToken: (body: { forgot_password_token: string }) =>
    http.post('/auth/verify-forgot-password', body),
  resetPassword: (body: { forgot_password_token: string; password: string; confirm_password: string }) =>
    http.post('/auth/reset-password', body)
}
