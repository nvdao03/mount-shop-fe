// --- Type API Get User Profile ---
export interface GetUserProfileResponseSuccess {
  message: string
  data: {
    id: number
    role: string
    email: string
    full_name: string
    phone: string
    address: string
    avatar: string
    created_at: string
    update_at: string
  }
}

// --- User Type ---
export interface UserType {
  id: number
  role: string
  email: string
  full_name: string
  phone: string
  address: string
  avatar: string
  created_at: string
  update_at: string
}
