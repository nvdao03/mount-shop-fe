import { Link, useNavigate } from 'react-router-dom'
import { PATH } from '../../../../constants/path'
import Logo from '../../../../assets/images/logo.png'
import { adminSidebars } from '../../../../data/admin-sidebar'
import { useContext } from 'react'
import { AppContext } from '../../../../contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../../../apis/shared/auth.api'
import { toast } from 'react-toastify'
import { AUTH_MESSAGE } from '../../../../constants/message'

export default function SidebarAdmin() {
  const { refreshToken, resetAppContext } = useContext(AppContext)
  const navigate = useNavigate()

  // --- Logout Mutation --- //
  const logoutMutation = useMutation({
    mutationFn: (body: { refresh_token: string }) => authApi.logout(body),
    onSuccess: () => {
      toast.success(AUTH_MESSAGE.LOGIN_SUCCESS)
      resetAppContext()
      navigate(PATH.HOME)
    }
  })

  // --- Handle Logout --- //
  const handleLogout = () => logoutMutation.mutate({ refresh_token: refreshToken as string })

  return (
    <div className='flex flex-col h-full'>
      {/* --- Logo --- */}
      <Link
        to={PATH.USER_PROFILE}
        className='px-4 py-5 flex items-center border-b-[0.5px] border-solid border-[#E6E6E6]'
      >
        <button className='bg-[#EAE9FC] p-3 rounded-[50%]'>
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 18' fill='none'>
            <path
              d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
              fill='#4F46E5'
            />
          </svg>
        </button>
        <button className='flex-shrink-0 text-xl ml-4 font-bold text-indigo-600'>
          <img src={Logo} alt='logo' />
        </button>
      </Link>
      {/* --- Menu --- */}
      <div className='mt-3'>
        <ul>
          {adminSidebars.map((sidebar) => (
            <li key={sidebar.id}>
              <Link className='flex items-center gap-3 px-4 py-4 font-semibold' to={sidebar.url}>
                {sidebar.icon}
                {sidebar.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* --- Logout --- */}
      <div className='px-4 mb-4 mt-auto'>
        <button
          onClick={() => handleLogout()}
          className='flex-1 bg-[#4F46E5] w-full mt-auto text-white rounded-lg py-3 text-center text-sm font-semibold'
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
