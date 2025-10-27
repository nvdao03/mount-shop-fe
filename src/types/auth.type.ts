export interface AuthResponseSuccess {
  message: string
  data: {
    access_token: string
    expires_access_token: number
    refresh_token: string
    expries_refresh_token: number
    user: {
      id: number
      role: string
      email: string
      full_name: string
      avatar: null
      created_at: string
      update_at: string
    }
  }
}

export interface VerifyEmailResponseSuccess {
  message: string
  data: {
    access_token: string
    expires_access_token: number
    refresh_token: string
    expries_refresh_token: number
    user: {
      id: number
      role: string
      email: string
      full_name: string
      avatar: null
      created_at: string
      update_at: string
    }
  }
}

export interface GoogleOauthResponseSuccess {
  access_token: string
  avatar: string
  created_at: string
  email: string
  expires_access_token: string
  expries_refresh_token: string
  full_name: string
  id: string
  refresh_token: string
  role: string
  updated_at: string
}
