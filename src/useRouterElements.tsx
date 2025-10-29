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
import AddCategory from './pages/admin/Categories/AddCategory'
import UpdateCategory from './pages/admin/Categories/UpdateCategory'
import AddBrand from './pages/admin/Brands/AddBrand'
import UpdateBrand from './pages/admin/Brands/UpdateBrand'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyForgotPassword from './pages/auth/VerifyForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Products from './pages/admin/Products'
import AddProduct from './pages/admin/Products/AddProduct'
import AdminProductDetail from './pages/admin/Products/AdminProductDetail'
import UpdateProduct from './pages/admin/Products/UpdateProduct'
import ProductList from './pages/shop/ProductList'
import ProductDetail from './pages/shop/ProductDetail'
import Comments from './pages/admin/Comments'
import Users from './pages/admin/Users'
import AddUser from './pages/admin/Users/AddUser'
import Cart from './pages/user/Cart'
import CheckOut from './pages/user/CheckOut'

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
      path: PATH.PRODUCT_LIST,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: PATH.PRODUCT_DETAIL,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: PATH.VERIFY_EMAIL,
      element: <VerifyEmail />
    },
    {
      path: PATH.FORGOT_PASSWORD,
      element: <ForgotPassword />
    },
    {
      path: PATH.VERIFY_FORGOT_PASSWORD,
      element: <VerifyForgotPassword />
    },
    {
      path: PATH.RESET_PASSWORD,
      element: <ResetPassword />
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
          path: PATH.USER_CART,
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          )
        },
        {
          path: PATH.USER_CHECKOUT,
          element: (
            <MainLayout>
              <CheckOut />
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
              path: PATH.ADMIN_ADD_CATEGORY,
              element: (
                <AdminLayout>
                  <AddCategory />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_UPDATE_CATEGORY,
              element: (
                <AdminLayout>
                  <UpdateCategory />
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
            },
            {
              path: PATH.ADMIN_ADD_BRAND,
              element: (
                <AdminLayout>
                  <AddBrand />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_UPDATE_BRAND,
              element: (
                <AdminLayout>
                  <UpdateBrand />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_PRODUCTS,
              element: (
                <AdminLayout>
                  <Products />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_ADD_PRODUCT,
              element: (
                <AdminLayout>
                  <AddProduct />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_PRODUCT_DETAIL,
              element: (
                <AdminLayout>
                  <AdminProductDetail />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_UPDATE_PRODUCT,
              element: (
                <AdminLayout>
                  <UpdateProduct />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_COMMENTS,
              element: (
                <AdminLayout>
                  <Comments />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_USERS,
              element: (
                <AdminLayout>
                  <Users />
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_ADD_USER,
              element: (
                <AdminLayout>
                  <AddUser />
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
