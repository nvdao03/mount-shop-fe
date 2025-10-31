import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { lazy, Suspense, useContext } from 'react'
import { AppContext } from './contexts/app.context'
import { PATH } from './constants/path'

import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/shop/Home'
import Profile from './pages/user/Profile'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyForgotPassword from './pages/auth/VerifyForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import ProductList from './pages/shop/ProductList'
import ProductDetail from './pages/shop/ProductDetail'
import Cart from './pages/user/Cart'
import CheckOut from './pages/user/CheckOut'
import OrderSuccess from './pages/user/OrderSuccess'
import OderDetail from './pages/user/OderDetail'

const Orders = lazy(() => import('./pages/admin/Orders'))
const Users = lazy(() => import('./pages/admin/Users'))
const Categories = lazy(() => import('./pages/admin/Categories'))
const AddCategory = lazy(() => import('./pages/admin/Categories/AddCategory'))
const UpdateCategory = lazy(() => import('./pages/admin/Categories/UpdateCategory'))
const AddBrand = lazy(() => import('./pages/admin/Brands/AddBrand'))
const UpdateBrand = lazy(() => import('./pages/admin/Brands/UpdateBrand'))
const Products = lazy(() => import('./pages/admin/Products'))
const Brands = lazy(() => import('./pages/admin/Brands'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const UpdateProduct = lazy(() => import('./pages/admin/Products/UpdateProduct'))
const AddProduct = lazy(() => import('./pages/admin/Products/AddProduct'))
const AdminProductDetail = lazy(() => import('./pages/admin/Products/AdminProductDetail'))
const Comments = lazy(() => import('./pages/admin/Comments'))
const AddUser = lazy(() => import('./pages/admin/Users/AddUser'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
          path: PATH.USER_ORDER_SUCCESS,
          element: (
            <MainLayout>
              <OrderSuccess />
            </MainLayout>
          )
        },
        {
          path: PATH.USER_ORDER_DETAIL,
          element: (
            <MainLayout>
              <OderDetail />
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
                  <Suspense>
                    <Dashboard />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_CATEGORIES,
              element: (
                <AdminLayout>
                  <Suspense>
                    <Categories />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_ADD_CATEGORY,
              element: (
                <AdminLayout>
                  <Suspense>
                    <AddCategory />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_UPDATE_CATEGORY,
              element: (
                <AdminLayout>
                  <Suspense>
                    <UpdateCategory />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_BRANDS,
              element: (
                <AdminLayout>
                  <Suspense>
                    <Brands />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_ADD_BRAND,
              element: (
                <AdminLayout>
                  <Suspense>
                    <AddBrand />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_UPDATE_BRAND,
              element: (
                <AdminLayout>
                  <Suspense>
                    <UpdateBrand />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_PRODUCTS,
              element: (
                <AdminLayout>
                  <Suspense>
                    <Products />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_ADD_PRODUCT,
              element: (
                <AdminLayout>
                  <Suspense>
                    <AddProduct />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_PRODUCT_DETAIL,
              element: (
                <AdminLayout>
                  <Suspense>
                    <AdminProductDetail />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_UPDATE_PRODUCT,
              element: (
                <AdminLayout>
                  <Suspense>
                    <UpdateProduct />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_COMMENTS,
              element: (
                <AdminLayout>
                  <Suspense>
                    <Comments />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_USERS,
              element: (
                <AdminLayout>
                  <Suspense>
                    <Users />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_ADD_USER,
              element: (
                <AdminLayout>
                  <Suspense>
                    <AddUser />
                  </Suspense>
                </AdminLayout>
              )
            },
            {
              path: PATH.ADMIN_ORDERS,
              element: (
                <AdminLayout>
                  <Suspense>
                    <Orders />
                  </Suspense>
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
    },
    {
      path: '*',
      element: (
        <Suspense>
          <NotFound />
        </Suspense>
      )
    }
  ])

  return useRouterElements
}
