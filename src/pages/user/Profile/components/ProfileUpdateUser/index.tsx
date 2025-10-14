import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../../../contexts/app.context'
import AvatarDefault from '../../../../../assets/images/avatar-default.png'
import InputAuth from '../../../../../components/InputAuth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaUpdateUser, type TypeUpdateSchemUser } from '../../../../../validation/user'
import { useNavigate } from 'react-router-dom'
import { PATH } from '../../../../../constants/path'
import type { UserType } from '../../../../../types/user.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '../../../../../apis/shared/media.api'
import { userApi } from '../../../../../apis/users/user.api'
import Loading from '../../../../../components/Loading'
import { toast } from 'react-toastify'
import { USER_MESSAGE } from '../../../../../constants/message'
import { saveAvtar, saveFullName } from '../../../../../utils/auth'

interface PropTypes {
  setMenu: React.Dispatch<React.SetStateAction<'sider_bar' | 'user_info' | 'order_item' | 'update_profile'>>
  user: UserType | null
}

export default function ProfileUpdateUser({ setMenu, user }: PropTypes) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setAvatar, setFullName } = useContext(AppContext)
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schemaUpdateUser),
    defaultValues: {
      full_name: '',
      phone: '',
      avatar: '',
      address: ''
    }
  })

  // --- Upload Image Mutation --- //
  const uploadImageMutation = useMutation({
    mutationFn: (files: FormData) => mediaApi.uploadImage(files),
    onSuccess: (response) => {
      const avatar = response.data.data[0].url
      setAvatarPreview(avatar)
    }
  })

  // --- Update Profile Mutation --- //
  const updateProfileMutation = useMutation({
    mutationFn: (body: TypeUpdateSchemUser) => userApi.updateProfile(body),
    onSuccess: (response) => {
      const updateuser = response.data.data as UserType
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      setFullName(updateuser.full_name)
      setAvatar(updateuser.avatar)
      saveAvtar(updateuser.avatar)
      saveFullName(updateuser.full_name)
      setMenu('user_info')
      toast.success(USER_MESSAGE.UPDATE_USER_SUCCESS, {
        style: {
          lineHeight: '1.5'
        }
      })
    }
  })

  // --- Set Form Default Values --- //
  useEffect(() => {
    if (user) {
      const { full_name, avatar, address, phone } = user
      setValue('full_name', full_name || '')
      setValue('avatar', avatar || '')
      setValue('address', address || '')
      setValue('phone', phone || '')
      setAvatarPreview(avatar || '')
    }
  }, [user, setValue])

  // --- Handle File Upload --- //
  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('image', file)
      })
      uploadImageMutation.mutate(formData)
    }
    e.target.value = ''
  }

  // --- Handle Submit Form --- //
  const handleSubmitUpdateProfile = handleSubmit((data: TypeUpdateSchemUser) => {
    updateProfileMutation.mutate({
      ...data,
      avatar: avatarPreview || user?.avatar
    })
  })

  return (
    <div className='flex flex-col h-full'>
      {/* Title */}
      <div className='px-4 py-6 flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6]'>
        <button
          onClick={() => {
            setMenu('user_info')
            navigate(PATH.USER_PROFILE)
          }}
          className='block bg-[#EAE9FC] p-2.5 rounded-full'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 12 18' fill='none'>
            <path
              d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
              fill='#4F46E5'
            />
          </svg>
        </button>
        <h2 className='custom_title_h2'>Cập nhật thông tin cá nhân</h2>
      </div>
      {/* Update User */}
      <form
        className='px-4 py-6 relative before:absolute before:bottom-[100px] before:left-0 before:w-full before:border-t-[0.5px] before:border-solid before:border-[#E6E6E6]'
        encType='multipart/form-data'
        method='post'
        onSubmit={handleSubmitUpdateProfile}
      >
        {/* Avatar */}
        <div className='relative w-[65px] h-[65px] md:w-[80px] md:h-[80px] rounded-full mx-auto sm:mx-0'>
          <label className='cursor-pointer block w-full h-full relative'>
            {/* Ảnh hiển thị */}
            <div className='w-full h-full relative'>
              <img
                className='w-full h-full object-cover rounded-full transition-all duration-300 group-hover:brightness-75'
                src={avatarPreview || user?.avatar || AvatarDefault}
                alt='avatar'
              />
              {/* Overlay khi đang upload */}
              {uploadImageMutation.isLoading && (
                <div className='absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center rounded-full z-20'>
                  <div className='w-8 h-8 md:w-9 md:h-9 flex justify-center items-center'>
                    <Loading />
                  </div>
                </div>
              )}
            </div>
            {/* Nút icon camera */}
            <div className='absolute right-0 bottom-0 flex justify-center items-center w-8 h-8 md:w-9 md:h-9 bg-[#4F46E5] rounded-full z-30'>
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='18' viewBox='0 0 20 18' fill='none'>
                <path
                  d='M20 4.625V15.875C20 16.9102 19.1602 17.75 18.125 17.75H1.875C0.839844 17.75 0 16.9102 0 15.875V4.625C0 3.58984 0.839844 2.75 1.875 2.75H5.3125L5.79297 1.46484C6.06641 0.734375 6.76562 0.25 7.54688 0.25H12.4492C13.2305 0.25 13.9297 0.734375 14.2031 1.46484L14.6875 2.75H18.125C19.1602 2.75 20 3.58984 20 4.625ZM14.6875 10.25C14.6875 7.66406 12.5859 5.5625 10 5.5625C7.41406 5.5625 5.3125 7.66406 5.3125 10.25C5.3125 12.8359 7.41406 14.9375 10 14.9375C12.5859 14.9375 14.6875 12.8359 14.6875 10.25ZM13.4375 10.25C13.4375 12.1445 11.8945 13.6875 10 13.6875C8.10547 13.6875 6.5625 12.1445 6.5625 10.25C6.5625 8.35547 8.10547 6.8125 10 6.8125C11.8945 6.8125 13.4375 8.35547 13.4375 10.25Z'
                  fill='white'
                />
              </svg>
              <input
                className='hidden'
                type='file'
                name='image'
                accept='image/*'
                disabled={uploadImageMutation.isLoading}
                onChange={handleOnChangeFile}
              />
            </div>
          </label>
        </div>

        {/* Form */}
        <div className='flex flex-col gap-4 mt-10 pb-6'>
          <InputAuth
            label='Họ và tên khách hàng'
            classNameLabel='block mb-2'
            classNameError='mt-2 flex items-center gap-1'
            classNameErrorMessage='text-red-500 text-[13px]'
            classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
            register={register}
            errorMessage={errors?.full_name?.message as string}
            type='text'
            name='full_name'
            errors={errors.full_name}
          />
          <div className='grid sm:grid-cols-2 gap-x-6 gap-4'>
            <InputAuth
              label='Số điện thoại'
              classNameLabel='block mb-2'
              classNameError='mt-2 flex items-center gap-1'
              classNameErrorMessage='text-red-500 text-[13px]'
              classNameInput='text-[14px] md:text-[15px] w-full h-full border border-solid border-[#B3B3B3] placeholder:text-[#666] placeholder:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
              register={register}
              errorMessage={errors?.phone?.message as string}
              type='text'
              name='phone'
              errors={errors.phone}
            />
            <div>
              <label className='block mb-2'>Email</label>
              <input
                onChange={() => null}
                value={user?.email || ''}
                disabled={true}
                type='text'
                className='text-[14px] block md:text-[15px] cursor-not-allowed bg-transparent w-full border border-solid border-[#B3B3B3] rounded-lg px-3 py-[10.5px] md:py-[9.5px] outline-none'
              />
            </div>
          </div>
          <div className=''>
            <label className='block mb-2'>Địa chỉ</label>
            <textarea
              {...register('address')}
              onInput={(e) => {
                const textarea = e.target as HTMLTextAreaElement
                textarea.style.height = 'auto'
                textarea.style.height = `${textarea.scrollHeight}px`
              }}
              className='text-[14px] md:text-[15px] leading-[1.5] min-h-[60px] w-full border border-solid border-[#B3B3B3] bg-transparent rounded-lg py-2 px-3 h-[80px] sm:h-[60px] focus:ring-2 focus:ring-blue-500 outline-none resize-none'
            ></textarea>
          </div>
        </div>
        {/* Submit */}
        <div className='mt-auto'>
          <div className='py-5 flex items-center gap-3 w-full sm:ml-auto sm:max-w-[184px]'>
            <button
              type='submit'
              className='flex-1 bg-[#4F46E5] text-white rounded-lg py-2 text-center text-sm font-semibold'
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
