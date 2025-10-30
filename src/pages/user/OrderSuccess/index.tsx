import ProductListSection from '../../../components/ProductListSection'
import OrderSuccesses from '../../../assets/images/order/order-success.png'
import { Link, useLocation } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import Confetti from '../../../components/Confetti'

export default function OrderSuccess() {
  const location = useLocation()
  const orderId = location.state.orderId

  return (
    <main className='w-full pt-[96px] md:pt-[117px]'>
      <Confetti />
      <div className='max-w-7xl mx-auto px-4 relative mb-4'>
        <div className='flex flex-col justify-center items-center gap-5 md:gap-6 w-full rounded-[10px] bg-white py-6 md:py-[50px]'>
          <div className=''>
            <img src={OrderSuccesses} alt='' />
          </div>
          <div className='flex flex-col px-4 items-center justify-center gap-4 w-full sm:max-w-[480px]'>
            <h2 className='custom_title_h2'>Đặt hàng thành công</h2>
            <p className='leading-[1.5] text-center'>
              Cảm ơn bạn đã đặt hàng cùng chúng tôi, đơn hàng sẽ được giao trong vòng 24h tới
            </p>
          </div>
          <div className='flex items-center px-4 gap-4 w-full sm:max-w-[480px]'>
            <Link
              to={PATH.HOME}
              className='flex items-center justify-center text-primary font-semibold border-primary border border-solid rounded-lg py-3 md:py-4 w-full'
            >
              Trở về trang chủ
            </Link>
            <Link
              to={`/order-detail/${orderId}`}
              className='flex items-center justify-center text-white bg-primary font-semibold border-primary border border-solid rounded-lg py-3 md:py-4 w-full'
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
      <ProductListSection title='Các sản phẩm tương tự' background='white' />
    </main>
  )
}
