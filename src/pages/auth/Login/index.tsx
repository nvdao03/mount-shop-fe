import BackgroundLogin from '../../../assets/images/login/background-login.jpg'
import { Link, useNavigate } from 'react-router-dom'
import googleIcon from '../../../assets/icons/google.svg'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useEffect, useState } from 'react'
import { schemaLogin, type TypeSchemaLogin } from '../../../utils/validation'
import InputAuth from '../../../components/InputAuth'
import { PATH } from '../../../constants/path'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../../apis/shared/auth.api'
import { toast } from 'react-toastify'
import { AUTH_MESSAGE } from '../../../constants/message'
import { AppContext } from '../../../contexts/app.context'
import type { AuthResponseSuccess } from '../../../types/auth.type'
import Loading from '../../../components/Loading'

type FormData = TypeSchemaLogin

export default function Login() {
  const { setIsAuthenticated, setAvatar, setEmail, setFullName, setRefreshToken, setUserRole } = useContext(AppContext)
  const navigate = useNavigate()

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(schemaLogin)
  })

  // --- Login mutation ---
  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body),
    onSuccess: (response) => {
      const data: AuthResponseSuccess = response.data
      toast.success(AUTH_MESSAGE.LOGIN_SUCCESS)
      setIsAuthenticated(true)
      setRefreshToken(data.data.refresh_token)
      setUserRole(data.data.user.role)
      setAvatar(data.data.user.avatar || '')
      setEmail(data.data.user.email)
      setFullName(data.data.user.full_name)
      navigate(PATH.HOME)
    },
    onError(errors: any) {
      const error = errors.response.data
      setError('email', {
        message: error.message,
        type: 'Server'
      })
      setError('password', {
        message: error.message,
        type: 'Server'
      })
    }
  })

  // --- Handle Submit Form ---
  const handleSubmitForm = handleSubmit((data: FormData) => {
    loginMutation.mutate(data)
  })

  // --- Handle Resize ---
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='min-h-screen flex'>
      {isDesktop && (
        <>
          <div className='hidden lg:flex w-1/2 relative'>
            <img src={BackgroundLogin} alt='Shopping' className='absolute inset-0 left-0 w-full h-full object-cover' />
            <div className='absolute inset-0  flex items-center justify-center'>
              <div className='flex flex-col justify-between text-white p-6 w-[85%] h-[85%] bg-black bg-opacity-40 border-[10px] border-solid'>
                <div className='flex items-center gap-3'>
                  <svg className='w-10 h-10' viewBox='0 0 54 54' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M27 0C21.6599 0 16.4398 1.58352 11.9996 4.55032C7.55954 7.5171 4.09881 11.7339 2.05526 16.6675C0.0116976 21.6011 -0.522989 27.0299 0.518808 32.2674C1.56061 37.505 4.13213 42.3158 7.90812 46.0915C11.6841 49.8676 16.4951 52.4392 21.7326 53.4813C26.9701 54.523 32.3989 53.9882 37.3326 51.945C42.2662 49.9011 46.4827 46.4404 49.4497 42.0003C52.4165 37.5602 54 32.34 54 26.9999C54 19.8391 51.1555 12.9715 46.0919 7.90811C41.0283 2.84462 34.1609 0 27 0ZM43.5855 30.9458C43.5855 31.4858 41.1479 31.5629 41.1479 32.103C41.1479 32.6429 43.5588 33.3758 43.5588 34.1203C43.5588 35.0305 38.5906 35.1654 38.5906 36.0759C38.5906 37.0479 42.359 36.7469 42.359 37.8C42.359 39.0419 32.8937 38.4633 32.8937 39.7555C32.8937 40.2491 34.105 40.4537 35.6208 40.6157C36.4539 40.7081 36.2725 41.117 35.7983 41.3872C33.1484 43.0039 30.1042 43.8594 27 43.8594C23.8958 43.8594 20.8516 43.0039 18.2018 41.3872C17.7313 41.0979 17.5461 40.6891 18.3793 40.6157C19.8951 40.4537 21.1102 40.23 21.1102 39.7555C21.1102 38.4633 11.6408 39.0419 11.6408 37.8C11.6408 36.7469 15.4132 37.0285 15.4132 36.0759C15.4132 35.1654 10.4413 35.0305 10.4413 34.1203C10.4413 33.3758 12.8559 32.6545 12.8559 32.103C12.8559 31.5514 10.4143 31.4896 10.4143 30.9458C10.4143 30.402 12.1964 30.0509 12.1964 29.6652C12.1964 28.9362 10.125 30.2631 10.125 26.9999C10.125 22.5244 11.903 18.2322 15.0676 15.0676C18.2323 11.9029 22.5245 10.125 27 10.125C31.4755 10.125 35.7678 11.9029 38.9325 15.0676C42.0971 18.2322 43.8749 22.5244 43.8749 26.9999C43.8749 30.2631 41.8038 28.9285 41.8038 29.6652C41.8038 30.0509 43.5855 30.3634 43.5855 30.9458Z'
                      fill='white'
                    />
                  </svg>
                  <p className='text-[#FFFFFF] font-semibold text-[30px]'>Mountshop</p>
                </div>
                <p className='font-bold text-[40px] leading-[1.3]'>Thảnh thơi mua sắm cùng chúng tôi</p>
              </div>
            </div>
          </div>
          <div className='hidden lg:flex w-1/2 items-center justify-center bg-white'>
            <div className='w-full max-w-md p-8'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold text-center'>
                  <span className='text-primary'>Chào mừng</span> bạn quay trở lại
                </h2>
                <p className='mb-5 pt-2 leading-[1.5]'>Đăng ký hoặc đăng nhập ngay</p>
              </div>
              <form className='flex flex-col gap-4' onSubmit={handleSubmitForm}>
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
                <InputAuth
                  label='Mật khẩu'
                  classNameLabel='block text-sm mb-1'
                  classNameError='mt-2 flex items-center gap-1'
                  classNameErrorMessage='text-red-500 text-[13px]'
                  classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                  register={register}
                  errorMessage={errors?.password?.message as string}
                  type='password'
                  name='password'
                  errors={errors.password}
                  placeholder='Nhập mật khẩu'
                />
                <button className='w-full bg-blue-600 hover:bg-blue-700 mt-1 text-white py-3 rounded-lg font-medium transition'>
                  {loginMutation.isLoading ? (
                    <div className='w-full flex items-center justify-center'>
                      <Loading className='w-6 h-6 fill-white' />
                    </div>
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </button>
              </form>
              <div className='flex items-center justify-center mt-4 text-color_auth'>
                <hr className='w-full h-[1.5px] bg-[#ccc]' />
                <span className='px-4 text-[15px]'>or</span>
                <hr className='w-full h-[1.5px] bg-[#ccc]' />
              </div>
              <Link
                to={''}
                className='w-full flex items-center justify-center gap-x-2 py-[11px] px-4 border border-solid border-[#B3B3B3] rounded-lg mt-4 text-[14px] font-semibold'
              >
                <img src={googleIcon} alt='google' />
                Continue with Google
              </Link>
              <div className='flex items-center gap-3 justify-center text-center text-sm mt-5'>
                <span className='block relative'>Chưa có tài khoản</span>
                <span className='relative after:absolute after:w-[4px] after:h-[4px] after:bg-[#1A1A1A] after:right-0 after:top-[50%] after:translate-y-[-50%] after:rounded-[999px]'></span>
                <Link to={PATH.REGISTER} className='text-primary font-semibold hover:underline'>
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {!isDesktop && (
        <div className='relative w-full lg:hidden'>
          <img src={BackgroundLogin} alt='Shopping' className='w-full h-screen object-cover' />
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white w-full max-w-sm rounded-xl shadow-lg p-6'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold text-center'>
                  <span className='text-primary'>Chào mừng</span> bạn quay trở lại
                </h2>
                <p className='mb-5 pt-2 leading-[1.5]'>Đăng ký hoặc đăng nhập ngay</p>
              </div>
              <form className='flex flex-col gap-4' onSubmit={handleSubmitForm}>
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
                <InputAuth
                  label='Mật khẩu'
                  classNameLabel='block text-sm mb-1'
                  classNameError='mt-2 flex items-center gap-1'
                  classNameErrorMessage='text-red-500 text-[13px]'
                  classNameInput='text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                  register={register}
                  errorMessage={errors?.password?.message as string}
                  type='password'
                  name='password'
                  errors={errors.password}
                  placeholder='Nhập mật khẩu'
                />
                <button className='w-full bg-blue-600 hover:bg-blue-700 mt-1 text-white py-3 rounded-lg font-medium transition'>
                  {loginMutation.isLoading ? (
                    <div className='w-full flex items-center justify-center'>
                      <Loading className='w-6 h-6 fill-white' />
                    </div>
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </button>
              </form>
              <div className='flex items-center justify-center mt-4 text-color_auth'>
                <hr className='w-full h-[1.5px] bg-[#ccc]' />
                <span className='px-4 text-[15px]'>or</span>
                <hr className='w-full h-[1.5px] bg-[#ccc]' />
              </div>
              <Link
                to={''}
                className='w-full flex items-center justify-center gap-x-2 py-[11px] px-4 border border-solid border-[#B3B3B3] rounded-lg mt-4 text-[14px] font-semibold'
              >
                <img src={googleIcon} alt='google' />
                Continue with Google
              </Link>
              <div className='flex items-center gap-3 justify-center text-center text-sm mt-5'>
                <span className='block relative'>Chưa có tài khoản</span>
                <span className='relative after:absolute after:w-[4px] after:h-[4px] after:bg-[#1A1A1A] after:right-0 after:top-[50%] after:translate-y-[-50%] after:rounded-[999px]'></span>
                <Link to={PATH.REGISTER} className='text-primary font-semibold hover:underline'>
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
