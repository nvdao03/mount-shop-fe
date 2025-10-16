import { PATH } from '../../../constants/path'
import Logo from '../../../assets/images/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import InputAuth from '../../../components/InputAuth'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../../apis/shared/auth.api'
import { schemaResetPassword } from '../../../validation/auth'
import Loading from '../../../components/Loading'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { AUTH_MESSAGE } from '../../../constants/message'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const forgot_password_token = location.state.forgot_password_token

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaResetPassword)
  })

  // --- Reset Password Mutation --- //
  const resetPasswordMutation = useMutation({
    mutationFn: (body: { password: string; confirm_password: string; forgot_password_token: string }) =>
      authApi.resetPassword(body),
    onSuccess: () => {
      toast.success(AUTH_MESSAGE.RESET_PASSWORD_SUCCESS)
      navigate(PATH.LOGIN)
    }
  })

  // --- Handle Submit Reset Password --- //
  const handleSubmitResetPassword = handleSubmit((data: { password: string; confirm_password: string }) => {
    resetPasswordMutation.mutate({
      ...data,
      forgot_password_token
    })
  })

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-50 w-full border-b border-solid border-gray-300 bg-white'>
        <div className='max-w-7xl flex items-center gap-x-4 mx-auto px-4 py-5'>
          <Link to={PATH.HOME} className='flex-shrink-0 text-xl font-bold text-indigo-600'>
            <img src={Logo} alt='logo' />
          </Link>
        </div>
      </header>
      <div className='mt-[68px] h-[calc(100vh-68px)]'>
        <div className='h-full flex justify-center items-center flex-col -mt-[20px] md:-mt-[50px]'>
          <div className='text-center w-full sm:w-[350px] px-4'>
            <h1 className='text-[18px] mt-4 font-semibold'>Thay Đổi Mật Khẩu</h1>
            <form className='flex flex-col mt-4 gap-4' onSubmit={handleSubmitResetPassword}>
              <InputAuth
                label='Password'
                classNameLabel='block text-sm mb-1'
                classNameError='mt-2 flex items-center gap-1'
                classNameErrorMessage='text-red-500 text-[13px]'
                classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                register={register}
                errorMessage={errors?.password?.message as string}
                type='text'
                name='password'
                errors={errors.password}
                placeholder='Nhập mật khẩu'
              />
              <InputAuth
                label='Xác nhận mật khẩu'
                classNameLabel='block text-sm mb-1'
                classNameError='mt-2 flex items-center gap-1'
                classNameErrorMessage='text-red-500 text-[13px]'
                classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                register={register}
                errorMessage={errors?.confirm_password?.message as string}
                type='text'
                name='confirm_password'
                errors={errors.confirm_password}
                placeholder='Nhập mật khẩu xác nhận'
              />
              <div className=''>
                <button
                  type='submit'
                  className='w-full py-[13px] px-4 bg-primary text-white rounded-[5px] mt-[10px] text-[14px] font-semibold'
                >
                  {resetPasswordMutation.isLoading ? (
                    <div className='w-full flex items-center justify-center'>
                      <Loading className='w-6 h-6 fill-white' />
                    </div>
                  ) : (
                    <span>Gửi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className='fixed left-0 bottom-0 right-0 w-full text-[15px] border-t border-solid border-gray-200'>
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
      </div>
    </>
  )
}
