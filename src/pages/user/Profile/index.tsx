import { useContext, useEffect, useState } from 'react'
import ProfileSidebar from './components/ProfileSidebar'
import ProfileUserInfo from './components/ProfileUserInfo'
import ProfileOrderItem from './components/ProfileOrderItem'
import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '../../../apis/shared/auth.api'
import { toast } from 'react-toastify'
import { AUTH_MESSAGE } from '../../../constants/message'
import { PATH } from '../../../constants/path'
import { AppContext } from '../../../contexts/app.context'
import { useNavigate } from 'react-router-dom'
import ProfileUpdateUser from './components/ProfileUpdateUser'
import type { GetUserProfileResponseSuccess, UserType } from '../../../types/user.type'
import { userApi } from '../../../apis/users/user.api'
import ProfileChangePassword from './components/ProfileChangePassword'

export default function Profile() {
  const { refreshToken: refresh_token, resetAppContext } = useContext(AppContext)
  const navigate = useNavigate()
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)
  const [menu, setMenu] = useState<'sider_bar' | 'user_info' | 'order_item' | 'update_profile' | 'change_password'>(
    isTablet ? 'sider_bar' : 'user_info'
  )
  const [user, setUser] = useState<UserType | null>(null)

  // --- Get User Profile ---
  const getUserProfile = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.getProfile(),
    staleTime: 30 * 60 * 1000
  })

  // --- Get User Profile ---
  useEffect(() => {
    if (getUserProfile?.data?.data) {
      const user = getUserProfile?.data?.data && (getUserProfile.data.data as GetUserProfileResponseSuccess)
      setUser(user?.data || null)
    }
  }, [getUserProfile?.data?.data])

  // --- Logout Mutation ---
  const logoutMutitation = useMutation({
    mutationFn: (body: { refresh_token: string }) => authApi.logout(body),
    onSuccess: () => {
      ;(toast.success(AUTH_MESSAGE.LOGOUT_SUCCESS), resetAppContext())
      navigate(PATH.HOME)
    }
  })

  // --- Handle Resize Screen --- //
  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isTablet])

  // --- Handle Open Menu ---
  const handleOpenMenu = (item: typeof menu) => {
    setMenu(item)
  }

  // --- Handle Logout ---
  const handleLogout = () => {
    logoutMutitation.mutate({ refresh_token: refresh_token as string })
  }

  return (
    <main className='w-full pt-[96px] md:pt-[117px]'>
      <div className='grid grid-cols-12 max-w-7xl gap-3 mx-auto px-4 relative min-h-[500px] sm:min-h-[540px]'>
        <section
          className={`relative col-span-12 md:col-span-4 lg:col-span-3 bg-white rounded-[10px] ${menu !== 'sider_bar' ? 'hidden md:block' : 'block'}`}
        >
          <ProfileSidebar handleOpenMenu={handleOpenMenu} handleLogout={handleLogout} />
          {isTablet && (
            <div className='px-4 mx-auto absolute bottom-4 w-full'>
              <button
                onClick={handleLogout}
                className='w-full  bg-[#4F46E5] text-white rounded-lg py-3 text-center text-sm font-semibold'
              >
                Đăng xuất
              </button>
            </div>
          )}
        </section>
        <section
          className={`${menu === 'sider_bar' ? 'hidden md:block' : 'block'} col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-[10px]`}
        >
          {menu === 'user_info' && <ProfileUserInfo user={user} setMenu={setMenu} />}
          {menu === 'order_item' && <ProfileOrderItem />}
          {menu === 'update_profile' && <ProfileUpdateUser user={user} setMenu={setMenu} />}
          {menu === 'change_password' && <ProfileChangePassword setMenu={setMenu} />}
        </section>
      </div>
    </main>
  )
}
