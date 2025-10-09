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
