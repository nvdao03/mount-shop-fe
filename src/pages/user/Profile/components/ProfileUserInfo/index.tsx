import { useContext, useState } from 'react'
import { AppContext } from '../../../../../contexts/app.context'
import AvatarDefault from '../../../../../assets/images/avatar-default.png'
import { useNavigate } from 'react-router-dom'
import { PATH } from '../../../../../constants/path'
import type { UserType } from '../../../../../types/user.type'

interface PropTypes {
  setMenu: React.Dispatch<
    React.SetStateAction<'sider_bar' | 'user_info' | 'order_item' | 'update_profile' | 'change_password'>
  >
  user: UserType | null
}

export default function ProfileUserInfo({ setMenu, user }: PropTypes) {
  const { avatar } = useContext(AppContext)
  const [isOpenAvatar, setIsOpenAvatar] = useState<boolean>(false)
  const navigate = useNavigate()

  return (
    <div className='flex flex-col h-full'>
      {/* Title */}
      <div className='px-4 py-6 flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6]'>
        <button
          onClick={() => {
            setMenu('sider_bar')
            navigate(PATH.USER_PROFILE)
          }}
          className='block md:hidden bg-[#EAE9FC] p-2.5 rounded-full'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 12 18' fill='none'>
            <path
              d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
              fill='#4F46E5'
            />
          </svg>
        </button>
        <h2 className='custom_title_h2'>Thông tin cá nhân</h2>
      </div>
      {/* Update User */}
      <form className='px-4 py-6'>
        {/* Avatar */}
        <div className='relative flex items-start justify-between'>
          <div className='cursor-pointer mx-auto md:mx-0 w-[65px] h-[65px] md:w-[80px] md:h-[80px] rounded-full'>
            <img
              onClick={() => setIsOpenAvatar(true)}
              className='w-full h-full object-cover rounded-full'
              src={avatar || AvatarDefault}
              alt='avatar'
            />
          </div>
          <button
            onClick={() => {
              navigate(PATH.USER_PROFILE)
              setMenu('update_profile')
            }}
            className='hidden md:block bg-[#4F46E5] text-white rounded-lg py-2 px-5 text-center text-sm font-semibold'
          >
            Chỉnh sửa
          </button>
        </div>
        {/* Form */}
        <div className='flex flex-col gap-4 mt-10'>
          <div>
            <label className='block mb-2'>Họ và tên khách hàng</label>
            <input
              value={user?.full_name || ''}
              disabled={true}
              type='text'
              className='text-[14px] cursor-not-allowed md:text-[15px] bg-transparent w-full h-full border border-solid border-[#B3B3B3] rounded-lg px-3 py-2 outline-none'
            />
          </div>
          <div className='grid lg:grid-cols-2 gap-x-6 gap-4'>
            <div>
              <label className='block mb-2'>Số điện thoại</label>
              <input
                value={user?.phone || ''}
                disabled={true}
                type='text'
                className='text-[14px] cursor-not-allowed md:text-[15px] bg-transparent w-full border border-solid border-[#B3B3B3] rounded-lg px-3 py-2 outline-none'
              />
            </div>
            <div>
              <label className='block mb-2'>Email</label>
              <input
                onChange={() => null}
                value={user?.email || ''}
                disabled={true}
                type='text'
                className='text-[14px] cursor-not-allowed md:text-[15px] bg-transparent w-full border border-solid border-[#B3B3B3] rounded-lg px-3 py-2 outline-none'
              />
            </div>
          </div>
          <div className=''>
            <label className='block mb-2'>Địa chỉ</label>
            <textarea
              disabled={true}
              value={user?.address || ''}
              className='text-[14px] cursor-not-allowed md:text-[15px] leading-[1.5] min-h-[60px] md:min-h-[100px] w-full border border-solid border-[#B3B3B3] bg-transparent rounded-lg py-2 px-3 h-[80px] sm:h-[60px] focus:ring-2 focus:ring-blue-500 outline-none resize-none'
            ></textarea>
          </div>
        </div>
      </form>
      {/* Action */}
      <div className='block md:hidden mt-auto border-t-[0.5px] border-solid border-[#E6E6E6]'>
        <div className='py-5 px-4 flex items-center gap-3 w-full sm:ml-auto sm:max-w-[300px]'>
          <button
            onClick={() => {
              navigate(PATH.USER_PROFILE)
              setMenu('update_profile')
            }}
            className='flex-1 bg-[#4F46E5] text-white rounded-lg py-3 text-center text-sm font-semibold'
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
      {/* Open Avatar */}
      {isOpenAvatar && (
        <div
          className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn'
          onClick={() => setIsOpenAvatar(false)}
        >
          <div className='relative max-w-[90%] max-h-[90%]' onClick={(e) => e.stopPropagation()}>
            <img
              src={avatar || AvatarDefault}
              alt='Avatar preview'
              className='rounded-lg max-h-[80vh] object-contain shadow-lg'
            />
            <button
              onClick={() => setIsOpenAvatar(false)}
              className='absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition'
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
