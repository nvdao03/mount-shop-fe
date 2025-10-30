import { createContext, useState } from 'react'
import {
  getAccessToken,
  getAvatar,
  getEmail,
  getFullName,
  getRefreshToken,
  getSelectedCartIds,
  getUserId,
  getUserRole
} from '../utils/auth'

// --- AppContext Type ---
interface AppContextType {
  isAuthenticated: boolean
  refreshToken: string
  userRole: string

  userId: number
  avatar: string
  email: string
  fullName: string

  selectedCartIds: number[]

  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>
  setUserRole: React.Dispatch<React.SetStateAction<string>>

  setUserId: React.Dispatch<React.SetStateAction<number>>
  setAvatar: React.Dispatch<React.SetStateAction<string>>
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setFullName: React.Dispatch<React.SetStateAction<string>>

  setSelectedCartIds: React.Dispatch<React.SetStateAction<number[]>>

  resetAppContext: () => void
}

// --- Inital Context value ---
const initalContextValues: AppContextType = {
  isAuthenticated: Boolean(getAccessToken()),
  refreshToken: getRefreshToken(),
  userRole: getUserRole(),

  userId: Number(getUserId()),
  avatar: getAvatar(),
  email: getEmail(),
  fullName: getFullName(),

  selectedCartIds: getSelectedCartIds(),

  setIsAuthenticated: () => null,
  setRefreshToken: () => null,
  setUserRole: () => null,

  setUserId: () => null,
  setAvatar: () => null,
  setEmail: () => null,
  setFullName: () => null,

  setSelectedCartIds: () => null,

  resetAppContext: () => null
}

export const AppContext = createContext<AppContextType>(initalContextValues)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initalContextValues.isAuthenticated)
  const [refreshToken, setRefreshToken] = useState<string>(initalContextValues.refreshToken)
  const [userId, setUserId] = useState<number>(initalContextValues.userId)
  const [userRole, setUserRole] = useState<string>(initalContextValues.userRole)
  const [avatar, setAvatar] = useState<string>(initalContextValues.avatar)
  const [email, setEmail] = useState<string>(initalContextValues.email)
  const [fullName, setFullName] = useState<string>(initalContextValues.fullName)
  const [selectedCartIds, setSelectedCartIds] = useState<number[]>(initalContextValues.selectedCartIds)

  const resetAppContext = () => {
    setIsAuthenticated(false)
    setRefreshToken('')
    setUserRole('')
    setAvatar('')
    setEmail('')
    setFullName('')
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        refreshToken,
        userId,
        userRole,
        avatar,
        email,
        fullName,
        selectedCartIds,
        setIsAuthenticated,
        setRefreshToken,
        setUserId,
        setUserRole,
        setAvatar,
        setEmail,
        setFullName,
        setSelectedCartIds,
        resetAppContext
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
