import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { PATH } from '../../../../../constants/path'
import InputAuth from '../../../../../components/InputAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaChangePassword, type TypeSchemaChangePassword } from '../../../../../validation/auth'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../../../../apis/shared/auth.api'
import { toast } from 'react-toastify'
import { AUTH_MESSAGE } from '../../../../../constants/message'
import { HTTP_STATUS } from '../../../../../constants/httpStatus'

interface PropTypes {
  setMenu: React.Dispatch<
    React.SetStateAction<'user_info' | 'sider_bar' | 'order_item' | 'update_profile' | 'change_password'>
  >
}

export default function ProfileChangePassword({ setMenu }: PropTypes) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(schemaChangePassword)
  })

  // --- Change Password Mutation --- //
  const changePasswordMutation = useMutation({
    mutationFn: (body: TypeSchemaChangePassword) => authApi.changePassword(body),
    onSuccess: () => {
      toast.success(AUTH_MESSAGE.CHANGE_PASSWORD_SUCCESS, { style: { lineHeight: '1.5' } })
      navigate(PATH.USER_PROFILE)
      setMenu('user_info')
    },
    onError: (errors: any) => {
      if (errors.response.status === HTTP_STATUS.UNAUTHORIZED) {
        const message = errors.response.data.message
        toast.warning(message)
      }
      const message = errors.response.data.errors.current_password.message
      setError('current_password', {
        message,
        type: 'Server'
      })
    }
  })

  // --- Handle Submit Change Password --- //
  const handleSubmitChangePassword = handleSubmit((data: TypeSchemaChangePassword) => {
    changePasswordMutation.mutate(data)
  })

  return (
    <div className='flex flex-col h-full'>
      {/* Title */}
      <div className='px-4 py-6 flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6]'>
        <button
          onClick={() => {
            setMenu('sider_bar')
            navigate(PATH.USER_PROFILE)
          }}
          className='bg-[#EAE9FC] p-2.5 rounded-full block md:hidden'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 12 18' fill='none'>
            <path
              d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
              fill='#4F46E5'
            />
          </svg>
        </button>
        <h2 className='custom_title_h2'>Thay đổi mật khẩu</h2>
      </div>
      {/* Form Change Password */}
      <form
        className='px-4 py-6 relative before:absolute before:bottom-[100px] before:left-0 before:w-full before:border-t-[0.5px] before:border-solid before:border-[#E6E6E6]'
        onSubmit={handleSubmitChangePassword}
      >
        {/* Form */}
        <div className='flex flex-col gap-4 pb-6'>
          <InputAuth
            label='Mật khẩu hiện tại'
            classNameLabel='block mb-2'
            classNameError='mt-2 flex items-center gap-1'
            classNameErrorMessage='text-red-500 text-[13px]'
            classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
            register={register}
            errorMessage={errors?.current_password?.message as string}
            type='text'
            name='current_password'
            errors={errors.current_password}
          />
          <InputAuth
            label='Mật khẩu mới'
            classNameLabel='block mb-2'
            classNameError='mt-2 flex items-center gap-1'
            classNameErrorMessage='text-red-500 text-[13px]'
            classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
            register={register}
            errorMessage={errors?.new_password?.message as string}
            type='text'
            name='new_password'
            errors={errors.new_password}
          />
          <InputAuth
            label='Nhập lại mật khẩu mới'
            classNameLabel='block mb-2'
            classNameError='mt-2 flex items-center gap-1'
            classNameErrorMessage='text-red-500 text-[13px]'
            classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
            register={register}
            errorMessage={errors?.confirm_password?.message as string}
            type='text'
            name='confirm_password'
            errors={errors.confirm_password}
          />
        </div>
        {/* Submit */}
        <div className='mt-auto'>
          <div className='py-5 flex items-center gap-3 w-full sm:ml-auto sm:max-w-[184px]'>
            <button className='flex-1 bg-[#4F46E5] text-white rounded-lg py-2 text-center text-sm font-semibold'>
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
