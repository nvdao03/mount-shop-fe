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
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Brands from './pages/admin/Brands'

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />
}

const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.HOME} />
}

const RoleGuard = ({ role }: { role: 'admin' | 'customer' }) => {
  const { userRole } = useContext(AppContext)

  if (userRole !== role) {
    return <Navigate to={PATH.HOME} />
  }

  return <Outlet />
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
        },
        {
          element: <RoleGuard role='admin' />,
          children: [
            {
              path: PATH.ADMIN_DASHBOARD,
              element: (
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_CATEGORIES,
              element: (
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_BRANDS,
              element: (
                <AdminLayout>
                  <Brands />
                </AdminLayout>
              )
            }
          ]
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
