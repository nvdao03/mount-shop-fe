import { Link } from 'react-router-dom'
import { PATH } from '../../constants/path'
import Logo from '../../assets/images/logo.png'
import Visa from '../../assets/images/footer/visa.svg'
import Momo from '../../assets/images/footer/momo.svg'
import Mastercard from '../../assets/images/footer/mastercard.svg'
import ViettelPay from '../../assets/images/footer/vittel-pay.svg'
import ZaloPay from '../../assets/images/footer/zalo-pay.svg'
import VNPay from '../../assets/images/footer/vn-pay.svg'
import WPay from '../../assets/images/footer/w-pay.svg'
import GHTK from '../../assets/images/footer/ghtk.svg'
import ViettelPost from '../../assets/images/footer/viettel-post.svg'
import JT from '../../assets/images/footer/jtexpress.svg'
import VIETNAMPost from '../../assets/images/footer/vietnam-post.svg'
import NinJaVan from '../../assets/images/footer/ninja-van.svg'
import Facebook from '../../assets/images/footer/facebook.svg'
import Zalo from '../../assets/images/footer/zalo.svg'
import Twiiter from '../../assets/images/footer/twitter.svg'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  // --- Handle Resize Screen ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    window.removeEventListener('resize', handleResize)
  }, [isMobile])

  return (
    <footer className='bg-white text-gray-700 mt-5'>
      {/* --- Footer Info --- */}
      <div className='max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-8'>
        {/* --- Cột 1: Logo + Thông tin công ty --- */}
        <div className='xl:col-span-3'>
          <div className='flex items-center gap-2'>
            <Link to={PATH.HOME} className='flex-shrink-0 text-xl font-bold text-indigo-600'>
              <img src={Logo} alt='logo' />
            </Link>
          </div>
          <h2 className='font-semibold text-[16px] md:text-[16px] mt-5 mb-4 leading-[1.5]'>
            Công ty cổ phần dịch vụ công nghệ Mount Shop
          </h2>
          <ul className='space-y-4 text-[14px] sm:text-[15px]'>
            <li>
              <Link to={'tel:0985732825'}>
                Điện thoại: <span className='text-primary hover:underline'>0985732825</span>
              </Link>
            </li>
            <li>
              <Link to={'mailto:nguyenvandao0307@gmail.com'}>
                Email: <span className='text-primary hover:underline'>nguyenvandao0307@gmail.com</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Cột 2: Về chúng tôi --- */}
        <div className='xl:col-span-2'>
          <h3 className='font-semibold'>VỀ CHÚNG TÔI</h3>
          <ul className='space-y-4 mt-5 text-[14px] sm:text-[15px]'>
            <li>Về chúng tôi</li>
            <li>Blog</li>
            <li>Quy định hoạt động</li>
            <li>Điều khoản sử dụng</li>
            <li>Hỗ trợ trả góp</li>
          </ul>
        </div>

        {/* --- Cột 3: Chính sách --- */}
        <div className='xl:col-span-2'>
          <h3 className='font-semibold'>VỀ CHÚNG TÔI</h3>
          <ul className='space-y-4 mt-5 text-[14px] sm:text-[15px]'>
            <li>Quy định trả hàng</li>
            <li>Chính sách mua sắm</li>
            <li>Khiếu nại</li>
            <li>Chính sách khuyến mãi</li>
            <li>Hỗ trợ trả góp</li>
          </ul>
        </div>

        {/* --- Cột 4: Hình thức thanh toán --- */}
        <div className='xl:col-span-3'>
          <h3 className='font-semibold whitespace-nowrap'>HÌNH THỨC THANH TOÁN</h3>
          <div className='flex items-center flex-wrap xl:grid xl:grid-cols-5 gap-x-3 gap-y-4 mt-5'>
            <img src={Visa} alt='Visa' />
            <div className='flex items-center justify-center'>
              <img src={Momo} alt='Momo' />
            </div>
            <img src={Mastercard} alt='Mastercard' />
            <img src={ViettelPay} alt='ViettelPay' />
            <img src={ZaloPay} alt='ZaloPay' />
            <img src={VNPay} alt='VNPay' />
            <img src={WPay} alt='WPay' />
          </div>
        </div>

        {/* --- Cột 5: Đối tác vận chuyển + Theo dõi --- */}
        <div className='space-y-6 sm:space-y-7 xl:col-span-2'>
          <div>
            <h3 className='font-semibold'>ĐỐI TÁC VẬN CHUYỂN</h3>
            <div className='flex items-center flex-wrap xl:grid xl:grid-cols-3 gap-x-3 gap-y-4 mt-5'>
              <img src={GHTK} alt='GHTK' />
              <img src={ViettelPost} alt='Viettel Post' />
              <img src={JT} alt='J&T' />
              <img src={VIETNAMPost} alt='Vietnam Post' />
              <img src={NinJaVan} alt='Ninja Van' />
            </div>
          </div>
          <div>
            <h3 className='font-semibold'>THEO DÕI CHÚNG TÔI</h3>
            <div className='flex gap-3 mt-5'>
              <img src={Twiiter} alt='Twitter' />
              <img src={Facebook} alt='Facebook' />
              <img src={Zalo} alt='Zalo' />
            </div>
          </div>
        </div>
      </div>

      {/* --- Copyright --- */}
      <div className='flex flex-col gap-3 font-semibold sm:font-normal sm:flex-row sm:items-center justify-between max-w-7xl mx-auto px-4 text-[15px] border-t border-solid border-gray-200 py-4'>
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
    </footer>
  )
}
