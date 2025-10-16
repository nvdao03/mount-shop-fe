import { XCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import Logo from '../../../assets/images/logo.png'
import useQueryParams from '../../../hooks/useQueryParams'
import type { ForgotPasswordQueryParamsConfig } from '../../../configs/auth.config'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../../apis/shared/auth.api'

export default function VerifyForgotPassword() {
  const queryParams: ForgotPasswordQueryParamsConfig = useQueryParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<boolean>(false)

  // --- Fotgot Password Mutation --- //
  const verifyFotgotPasswordMutation = useMutation({
    mutationFn: (body: { forgot_password_token: string }) => authApi.verifyForgotPasswodToken(body),
    onSuccess: () => {
      setStatus(false)
      navigate(PATH.RESET_PASSWORD, {
        state: {
          forgot_password_token: queryParams.forgot_password_token
        }
      })
    },
    onError: () => {
      setStatus(true)
    }
  })

  useEffect(() => {
    if (queryParams.forgot_password_token) {
      verifyFotgotPasswordMutation.mutate({ forgot_password_token: queryParams.forgot_password_token })
    }
  }, [])

  return (
    <>
      {status && (
        <>
          <header className='fixed top-0 left-0 right-0 z-50 w-full border-b border-solid border-gray-300 bg-white'>
            <div className='max-w-7xl flex items-center gap-x-4 mx-auto px-4 py-5'>
              <Link to={PATH.HOME} className='flex-shrink-0 text-xl font-bold text-indigo-600'>
                <img src={Logo} alt='logo' />
              </Link>
            </div>
          </header>
          <div className='flex items-center justify-center h-screen bg-[#F5F5FA] px-4 text-[#1A1A1A]'>
            <div className='bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-solid border-gray-300'>
              {status && (
                <div className='flex flex-col items-center'>
                  <XCircle className='w-[45px] h-[45px] text-red-400' />
                  <h2 className='mt-4 text-[20px] font-bold text-red-400'>Xác thực thất bại</h2>
                  <p className='mt-3 text-[15px] leading-[1.5]'>
                    Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className='fixed left-0 bottom-0 right-0 w-full text-[15px] border-t border-solid border-gray-200 bg-white'>
            <div className='max-w-7xl mx-auto px-4 flex flex-col gap-3 font-semibold sm:font-normal sm:flex-row sm:items-center justify-between py-5'>
              <p>Bản Quyền Website Nguyễn Văn Đạo</p>
              <div className='flex gap-6'>
                <Link to={''} className='hover:underline'>
                  Chính sách bảo mật
                </Link>
                <Link to={''} className='hover:underline'>
                  Quyền riêng tư
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
