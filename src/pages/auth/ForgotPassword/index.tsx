import { useForm } from 'react-hook-form'
import InputAuth from '../../../components/InputAuth'
import { PATH } from '../../../constants/path'
import { Link } from 'react-router-dom'
import Logo from '../../../assets/images/logo.png'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaForgotPassword, type TypeSchemaForgotPassword } from '../../../validation/auth'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../../apis/shared/auth.api'
import Loading from '../../../components/Loading'

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: yupResolver(schemaForgotPassword)
  })

  // --- Forogt Password Mutation --- //
  const forgotPasswordMutation = useMutation({
    mutationFn: (body: TypeSchemaForgotPassword) => authApi.forgotPassword(body),
    onSuccess: () => {
      reset({ email: '' })
    },
    onError: (errors: any) => {
      const message = errors.response.data.errors.email.message
      setError('email', {
        message,
        type: 'Server'
      })
    }
  })

  // --- Handle Submit Forgot Password --- //
  const handleSubmitFotgotPassword = handleSubmit((data: TypeSchemaForgotPassword) => {
    forgotPasswordMutation.mutate(data)
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
            <h1 className='text-[18px] mt-4 font-semibold'>Quên Mật Khẩu</h1>
            {forgotPasswordMutation.isSuccess && (
              <p className='mt-3 text-[15px] text-green-500 leading-[1.5] font-semibold'>
                Vui lòng kiểm tra email của bạn để xác nhận thay đổi mật khẩu.
              </p>
            )}
            <form className='mt-4' onSubmit={handleSubmitFotgotPassword}>
              <InputAuth
                label='Email'
                classNameLabel='block text-sm mb-1'
                classNameError='mt-2 flex items-center gap-1'
                classNameErrorMessage='text-red-500 text-[13px]'
                classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                register={register}
                errorMessage={errors?.email?.message as string}
                type='email'
                name='email'
                errors={errors.email}
                placeholder='Nhập địa chỉ email'
              />
              <div className=''>
                <button className='w-full py-[13px] px-4 bg-primary text-white rounded-[5px] mt-[15px] text-[14px] font-semibold'>
                  {forgotPasswordMutation.isLoading ? (
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
