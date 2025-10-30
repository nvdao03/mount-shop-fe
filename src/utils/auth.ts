// --- helper chung ---
const saveToLocalStorage = (key: string, value: string) => localStorage.setItem(key, value)
const getFromLocalStorage = (key: string) => localStorage.getItem(key) || ''
const removeFromLocalStorage = (key: string) => localStorage.removeItem(key)

// --- auth ---
export const saveAccessToken = (token: string) => saveToLocalStorage('access_token', token)
export const saveRefreshToken = (token: string) => saveToLocalStorage('refresh_token', token)
export const saveUserRole = (role: string) => saveToLocalStorage('role', role)

export const getAccessToken = () => getFromLocalStorage('access_token')
export const getRefreshToken = () => getFromLocalStorage('refresh_token')
export const getUserRole = () => getFromLocalStorage('role')

export const removeAccessToken = () => removeFromLocalStorage('access_token')
export const removeRefreshToken = () => removeFromLocalStorage('refresh_token')
export const removeUserRole = () => removeFromLocalStorage('role')

// --- user ---
export const saveUserId = (id: string) => saveToLocalStorage('user_id', id)
export const saveAvtar = (avatar: string) => saveToLocalStorage('avatar', avatar)
export const saveFullName = (fulName: string) => saveToLocalStorage('full_name', fulName)
export const saveEmail = (email: string) => saveToLocalStorage('email', email)

export const getUserId = () => getFromLocalStorage('user_id')
export const getAvatar = () => getFromLocalStorage('avatar')
export const getFullName = () => getFromLocalStorage('full_name')
export const getEmail = () => getFromLocalStorage('email')

export const removeUserId = () => removeFromLocalStorage('user_id')
export const removeAvatar = () => removeFromLocalStorage('avatar')
export const removeFullName = () => removeFromLocalStorage('full_name')
export const removeEmail = () => removeFromLocalStorage('email')

// --- cart ---
export const saveSelectedCartIds = (cartIds: number[]) => saveToLocalStorage('cartIds', JSON.stringify(cartIds))
export const getSelectedCartIds = () => JSON.parse(getFromLocalStorage('cartIds') || '[]')
export const removeSelectedCartIds = () => removeFromLocalStorage('cartIds')

// --- reset ---
export const resetToLocalStorage = () => {
  removeAccessToken()
  removeRefreshToken()
  removeUserRole()

  removeUserId()
  removeAvatar()
  removeFullName()
  removeEmail()

  removeSelectedCartIds()
}
