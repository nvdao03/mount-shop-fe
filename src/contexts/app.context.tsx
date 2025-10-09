import { createContext, useState } from 'react'
import { getAccessToken, getAvatar, getEmail, getFullName, getRefreshToken, getUserRole } from '../utils/auth'

// --- AppContext Type ---
interface AppContextType {
  isAuthenticated: boolean
  refreshToken: string
  userRole: string

  avatar: string
  email: string
  fullName: string

  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>
  setUserRole: React.Dispatch<React.SetStateAction<string>>

  setAvatar: React.Dispatch<React.SetStateAction<string>>
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setFullName: React.Dispatch<React.SetStateAction<string>>

  resetAppContext: () => void
}

// --- Inital Context value ---
const initalContextValues: AppContextType = {
  isAuthenticated: Boolean(getAccessToken()),
  refreshToken: getRefreshToken(),
  userRole: getUserRole(),

  avatar: getAvatar(),
  email: getEmail(),
  fullName: getFullName(),

  setIsAuthenticated: () => null,
  setRefreshToken: () => null,
  setUserRole: () => null,

  setAvatar: () => null,
  setEmail: () => null,
  setFullName: () => null,

  resetAppContext: () => null
}

export const AppContext = createContext<AppContextType>(initalContextValues)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initalContextValues.isAuthenticated)
  const [refreshToken, setRefreshToken] = useState<string>(initalContextValues.refreshToken)
  const [userRole, setUserRole] = useState<string>(initalContextValues.userRole)
  const [avatar, setAvatar] = useState<string>(initalContextValues.avatar)
  const [email, setEmail] = useState<string>(initalContextValues.email)
  const [fullName, setFullName] = useState<string>(initalContextValues.fullName)

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
        userRole,
        avatar,
        email,
        fullName,
        setIsAuthenticated,
        setRefreshToken,
        setUserRole,
        setAvatar,
        setEmail,
        setFullName,
        resetAppContext
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
