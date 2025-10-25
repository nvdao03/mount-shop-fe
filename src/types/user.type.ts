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

// --- Admin Get User Type ---
export interface AdminGetUserType {
  id: number
  full_name: string
  email: string
  phone: null
  address: null
  verify: string
  avatar: null
  role: string
  role_id: number
}

// --- Admin Get All Users ---
export interface GetUsersAllResponseSuccess {
  message: string
  data: {
    users: AdminGetUserType[]
    pagiantion: {
      page: number
      limit: number
      total_page: number
    }
  }
}
