import { useRoutes } from 'react-router-dom'
import { PATH } from './constants/path'
import AuthLayout from './layouts/AuthLayout'
import Register from './pages/auth/Register'
import MainLayout from './layouts/MainLayout'
import Login from './pages/auth/Login'
import Home from './pages/shop/Home'

export default function useRouterElements() {
  const useRouterElements = useRoutes([
    {
      path: PATH.LOGIN,
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: PATH.REGISTER,
      element: (
        <AuthLayout>
          <Register />
        </AuthLayout>
      )
    },
    {
      path: PATH.HOME,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    }
  ])

  return useRouterElements
}
