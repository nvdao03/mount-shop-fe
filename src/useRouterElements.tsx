import { useRoutes } from 'react-router-dom'
import { PATH } from './constants/path'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

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
