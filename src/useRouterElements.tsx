import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATH } from './constants/path'
import AuthLayout from './layouts/AuthLayout'
import Register from './pages/auth/Register'
import MainLayout from './layouts/MainLayout'
import Login from './pages/auth/Login'
import Home from './pages/shop/Home'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import Profile from './pages/user/Profile'
import ProfileUpdateUser from './pages/user/Profile/components/ProfileUpdateUser'

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />
}

const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.HOME} />
}

export default function useRouterElements() {
  const useRouterElements = useRoutes([
    {
      path: PATH.HOME,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.USER_PROFILE,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      element: <RejectedRoute />,
      children: [
        {
          path: PATH.REGISTER,
          element: (
            <AuthLayout>
              <Register />
            </AuthLayout>
          )
        },
        {
          path: PATH.LOGIN,
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        }
      ]
    }
  ])

  return useRouterElements
}
