import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { VerifyEmailQueryParamsConfig } from '../../../configs/auth.config'
import useQueryParams from '../../../hooks/useQueryParams'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../../apis/shared/auth.api'
import { AppContext } from '../../../contexts/app.context'
import { PATH } from '../../../constants/path'
import type { VerifyEmailResponseSuccess } from '../../../types/auth.type'
import {
  saveAccessToken,
  saveAvtar,
  saveEmail,
  saveFullName,
  saveRefreshToken,
  saveUserRole
} from '../../../utils/auth'
import { HTTP_STATUS } from '../../../constants/httpStatus'

export default function VerifyEmail() {
  const { setAvatar, setFullName, setRefreshToken, setEmail, setUserRole, setIsAuthenticated } = useContext(AppContext)
  const queryParams: VerifyEmailQueryParamsConfig = useQueryParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'success_before'>('loading')
  const [message, setMessage] = useState<string>('')

  const verifyEmailMutation = useMutation({
    mutationFn: (body: { email_verify_token: string }) => authApi.verifyEmail(body),
    onSuccess: (response) => {
      if (!response.data.data) return

      console.log(response)

      const data = response.data as VerifyEmailResponseSuccess

      setAvatar(data.data.user.avatar || '')
      setEmail(data.data.user.email)
      setFullName(data.data.user.full_name)
      setUserRole(data.data.user.role)
      setRefreshToken(data.data.refresh_token)
      setIsAuthenticated(true)

      saveAccessToken(data.data.access_token)
      saveRefreshToken(data.data.refresh_token)
      saveAvtar(data.data.user.avatar || '')
      saveEmail(data.data.user.email)
      saveFullName(data.data.user.full_name)
      saveRefreshToken(data.data.refresh_token)
      saveUserRole(data.data.user.role)

      setStatus('success')
      setMessage(data.message)

      setTimeout(() => {
        navigate(PATH.HOME)
      }, 4000)
    },
    onError: (errors: any) => {
      if (errors.response.status === HTTP_STATUS.CONFLICT) {
        setStatus('success_before')
        setMessage(errors.response.data.message)
      }
      if (errors.response.status === HTTP_STATUS.BAD_REQUEST) {
        setStatus('error')
        setMessage(errors.response.data.message)
      }
    }
  })

  useEffect(() => {
    if (queryParams.email_verify_token) {
      verifyEmailMutation.mutate({ email_verify_token: queryParams.email_verify_token })
    }
  }, [])

  return (
    <div className='flex items-center justify-center h-screen bg-[#F5F5FA] px-4'>
      <div className='bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-solid border-gray-300'>
        {status === 'loading' && (
          <div className='flex flex-col items-center'>
            <Loader2 className='w-[45px] h-[45px] text-cyan-400 animate-spin' />
            <h2 className='mt-3 text-[15px] font-semibold text-[#000]'>Đang xác thực email...</h2>
          </div>
        )}
        {status === 'success_before' && (
          <div className='flex flex-col items-center'>
            <CheckCircle className='w-[45px] h-[45px] text-green-400' />
            <h2 className='mt-4 font-bold text-[#000] text-[18px]'>{message}</h2>
          </div>
        )}
        {status === 'success' && (
          <div className='flex flex-col items-center'>
            <CheckCircle className='w-[45px] h-[45px] text-green-400' />
            <h2 className='mt-4 font-bold text-green-400 text-[20px]'>{message}</h2>
            <p className='mt-3 text-[#000] text-[16px]'>Đang điều hướng về trang web...</p>
          </div>
        )}
        {status === 'error' && (
          <div className='flex flex-col items-center'>
            <XCircle className='w-[45px] h-[45px] text-red-400' />
            <h2 className='mt-4 text-[20px] font-bold text-red-400'>Xác thực email thất bại</h2>
            <p className='mt-3 text-[#000] text-[18px]'>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
