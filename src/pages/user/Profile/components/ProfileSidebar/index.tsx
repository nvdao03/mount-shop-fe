import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../../../contexts/app.context'
import AvatarDefault from '../../../../../assets/images/avatar-default.png'
import User from '../../../../../assets/icons/user.svg'
import Cart from '../../../../../assets/icons/cart.svg'
import { ROLES } from '../../../../../constants/other'
import { Link } from 'react-router-dom'
import { PATH } from '../../../../../constants/path'

interface PropTypes {
  handleOpenMenu: (item: 'user_info' | 'order_item' | 'change_password') => void
  handleLogout: () => void
}

export default function ProfileSidebar({ handleOpenMenu, handleLogout }: PropTypes) {
  const { avatar, fullName, userRole } = useContext(AppContext)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768)

  // --- Handle Resize Screen ---
  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className=''>
      {/* User Info */}
      <div className='px-4 py-6 flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6]'>
        <div className='w-[40px] h-[40px] md:w-[44px] md:h-[44px] flex-shrink-0 rounded-full'>
          <img
            className='w-full h-full object-cover rounded-full flex-shrink-0'
            src={avatar || AvatarDefault}
            alt='avatar'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <h3 className='text-[16px] font-semibold leading-[1.5]'>{fullName}</h3>
          <span className='text-[14px] text-[#333]'>Tài khoản của bạn</span>
        </div>
      </div>
      {/* User Menu */}
      <div className=''>
        <ul>
          <li>
            <button
              onClick={() => handleOpenMenu('user_info')}
              className='w-full py-[18px] px-4 flex items-center justify-between'
            >
              <div className='flex items-center gap-3'>
                <img className='flex-shrink-0' src={User} alt='' />
                <span className='font-semibold'>Thông tin cá nhân</span>
              </div>
              <svg className='block md:hidden w-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 20' fill='none'>
                <path
                  d='M13.0149 11.0622L4.51751 19.5595C3.93019 20.1468 2.98049 20.1468 2.39942 19.5595L0.987362 18.1475C0.400046 17.5601 0.400046 16.6104 0.987362 16.0294L7.01048 10.0062L0.987362 3.98313C0.400046 3.39581 0.400046 2.44611 0.987362 1.86504L2.39317 0.440487C2.98049 -0.146829 3.93019 -0.146829 4.51126 0.440487L13.0086 8.93783C13.6022 9.52515 13.6022 10.4749 13.0149 11.0622Z'
                  fill='#1A1A1A'
                />
              </svg>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleOpenMenu('order_item')}
              className='w-full py-[18px] px-4 flex items-center justify-between'
            >
              <div className='flex items-center gap-3'>
                <img className='flex-shrink-0' src={Cart} alt='' />
                <span className='font-semibold'>Đơn hàng của tôi</span>
              </div>
              <svg className='block md:hidden w-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 20' fill='none'>
                <path
                  d='M13.0149 11.0622L4.51751 19.5595C3.93019 20.1468 2.98049 20.1468 2.39942 19.5595L0.987362 18.1475C0.400046 17.5601 0.400046 16.6104 0.987362 16.0294L7.01048 10.0062L0.987362 3.98313C0.400046 3.39581 0.400046 2.44611 0.987362 1.86504L2.39317 0.440487C2.98049 -0.146829 3.93019 -0.146829 4.51126 0.440487L13.0086 8.93783C13.6022 9.52515 13.6022 10.4749 13.0149 11.0622Z'
                  fill='#1A1A1A'
                />
              </svg>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleOpenMenu('change_password')}
              className='w-full py-[18px] px-[18px] flex items-center justify-between'
            >
              <div className='flex items-center gap-3'>
                <svg
                  className='w-6 h-6 text-[#4F46E5] fill-[#4F46E5]'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 16'
                  fill='#4F46E5'
                >
                  <path
                    d='M7.00027 7.99982C9.20973 7.99982 11.0004 6.20913 11.0004 3.99967C11.0004 1.79021 9.20973 -0.000488281 7.00027 -0.000488281C4.79081 -0.000488281 3.00012 1.79021 3.00012 3.99967C3.00012 6.20913 4.79081 7.99982 7.00027 7.99982ZM9.80038 8.99986H9.27849C8.58471 9.31863 7.81281 9.49988 7.00027 9.49988C6.18774 9.49988 5.41896 9.31863 4.72206 8.99986H4.20016C1.88132 8.99986 0 10.8812 0 13.2V14.5001C0 15.3282 0.671901 16.0001 1.50006 16.0001H10.091C10.016 15.7876 9.98477 15.5626 10.0098 15.3345L10.2223 13.4313L10.2598 13.0844L10.5067 12.8375L12.9224 10.4218C12.1567 9.55614 11.0473 8.99986 9.80038 8.99986ZM11.2161 13.5407L11.0036 15.447C10.9692 15.7658 11.2379 16.0345 11.5536 15.997L13.4568 15.7845L17.7663 11.475L15.5256 9.23425L11.2161 13.5407ZM19.782 8.40297L18.5976 7.21854C18.307 6.92791 17.8319 6.92791 17.5413 7.21854L16.36 8.39984L16.2319 8.52797L18.4757 10.7687L19.782 9.46238C20.0727 9.16862 20.0727 8.69673 19.782 8.40297Z'
                    fill='#4F46E5'
                  />
                </svg>
                <span className='font-semibold'>Đổi mật khẩu</span>
              </div>
              <svg className='block md:hidden w-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 20' fill='none'>
                <path
                  d='M13.0149 11.0622L4.51751 19.5595C3.93019 20.1468 2.98049 20.1468 2.39942 19.5595L0.987362 18.1475C0.400046 17.5601 0.400046 16.6104 0.987362 16.0294L7.01048 10.0062L0.987362 3.98313C0.400046 3.39581 0.400046 2.44611 0.987362 1.86504L2.39317 0.440487C2.98049 -0.146829 3.93019 -0.146829 4.51126 0.440487L13.0086 8.93783C13.6022 9.52515 13.6022 10.4749 13.0149 11.0622Z'
                  fill='#1A1A1A'
                />
              </svg>
            </button>
          </li>
          {userRole === ROLES.ADMIN && (
            <li>
              <Link to={PATH.ADMIN_DASHBOARD} className='w-full py-[18px] px-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <svg className='w-6 h-6 fill-[#4F46E5]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
                    <path d='M136 192C136 125.7 189.7 72 256 72C322.3 72 376 125.7 376 192C376 258.3 322.3 312 256 312C189.7 312 136 258.3 136 192zM48 546.3C48 447.8 127.8 368 226.3 368L285.7 368C384.2 368 464 447.8 464 546.3C464 562.7 450.7 576 434.3 576L77.7 576C61.3 576 48 562.7 48 546.3zM544 160C557.3 160 568 170.7 568 184L568 232L616 232C629.3 232 640 242.7 640 256C640 269.3 629.3 280 616 280L568 280L568 328C568 341.3 557.3 352 544 352C530.7 352 520 341.3 520 328L520 280L472 280C458.7 280 448 269.3 448 256C448 242.7 458.7 232 472 232L520 232L520 184C520 170.7 530.7 160 544 160z' />
                  </svg>
                  <span className='font-semibold'>Trang quản trị</span>
                </div>
                <svg className='block md:hidden w-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 20' fill='none'>
                  <path
                    d='M13.0149 11.0622L4.51751 19.5595C3.93019 20.1468 2.98049 20.1468 2.39942 19.5595L0.987362 18.1475C0.400046 17.5601 0.400046 16.6104 0.987362 16.0294L7.01048 10.0062L0.987362 3.98313C0.400046 3.39581 0.400046 2.44611 0.987362 1.86504L2.39317 0.440487C2.98049 -0.146829 3.93019 -0.146829 4.51126 0.440487L13.0086 8.93783C13.6022 9.52515 13.6022 10.4749 13.0149 11.0622Z'
                    fill='#1A1A1A'
                  />
                </svg>
              </Link>
            </li>
          )}
          <li>
            {!isTablet && (
              <button onClick={handleLogout} className='ml-[2px] w-full py-[18px] px-4 flex items-center gap-3'>
                <svg className='w-6 h-6 fill-[#4F46E5]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
                  <path d='M569 337C578.4 327.6 578.4 312.4 569 303.1L425 159C418.1 152.1 407.8 150.1 398.8 153.8C389.8 157.5 384 166.3 384 176L384 256L272 256C245.5 256 224 277.5 224 304L224 336C224 362.5 245.5 384 272 384L384 384L384 464C384 473.7 389.8 482.5 398.8 486.2C407.8 489.9 418.1 487.9 425 481L569 337zM224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160z' />
                </svg>
                <span className='font-semibold'>Đăng xuất</span>
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}
