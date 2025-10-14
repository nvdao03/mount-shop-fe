import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { AuthResponseSuccess } from '../types/auth.type'
import {
  getAccessToken,
  getAvatar,
  getEmail,
  getFullName,
  getRefreshToken,
  getUserRole,
  resetToLocalStorage,
  saveAccessToken,
  saveAvtar,
  saveEmail,
  saveFullName,
  saveRefreshToken,
  saveUserRole
} from './auth'

const URL = import.meta.env.VITE_API_ROOT

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private userRole: string
  private avatar: string
  private email: string
  private fullName: string

  constructor() {
    this.accessToken = getAccessToken()
    this.refreshToken = getRefreshToken()
    this.userRole = getUserRole()
    this.avatar = getAvatar()
    this.email = getEmail()
    this.fullName = getFullName()
    this.instance = axios.create({
      baseURL: URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        const access_token = getAccessToken()
        if (access_token && config.headers) {
          config.headers.Authorization = `Bearer ${access_token}`
        }
        if (config.data instanceof FormData) {
          config.headers['Content-Type'] = 'multipart/form-data'
        } else {
          config.headers['Content-Type'] = 'application/json'
        }
        return config
      },
      (error) => {
        // Làm gì đó với lỗi request
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/auth/register' || url === '/auth/login') {
          const data: AuthResponseSuccess = response.data
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          this.userRole = data.data.user.role
          this.avatar = data.data.user.avatar || ''
          this.email = data.data.user.email
          this.fullName = data.data.user.full_name
          saveAccessToken(this.accessToken)
          saveRefreshToken(this.refreshToken)
          saveUserRole(this.userRole)
          saveAvtar(this.avatar)
          saveEmail(this.email)
          saveFullName(this.fullName)
        } else if (url === '/auth/logout') {
          this.accessToken = ''
          this.refreshToken = ''
          this.userRole = ''
          this.avatar = ''
          this.email = ''
          this.fullName = ''
          resetToLocalStorage()
        }
        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
