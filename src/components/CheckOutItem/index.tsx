import type { CartType } from '../../types/cart.type'
import { formatCurrency } from '../../utils/other'

interface PropTypes {
  cart: CartType
}

export default function CheckOutItem({ cart }: PropTypes) {
  return (
    <div className='mt-2 md:mt-4 bg-white py-4 px-2 md:px-4 rounded-[10px] flex flex-col md:gap-8 md:flex md:flex-row md:items-center md:justify-between'>
      <div className='flex items-start gap-4'>
        <div className='flex gap-3 md:gap-4'>
          <div className='flex-shrink-0 w-[80px] h-[80px]'>
            <img className='flex-shrink-0 rounded-[5px] object-cover' src={cart.image} alt={cart.name} />
          </div>
          <div className='flex flex-col gap-3 md:flex md:flex-col md:justify-around md:gap-2'>
            <h3 className='font-semibold text-[16px] leading-[1.5] md:text-[16px]'>{cart.name}</h3>
            <div className='text-[14px]'>
              <span className='block leading-[1.5]'>Thương hiệu: {cart.brand}</span>
            </div>
            <div className='flex items-center flex-wrap gap-2 leading-[1.5]'>
              <span className='text-[18px] sm:text-[19px] font-semibold text-primary'>
                {formatCurrency(cart.price)}đ
              </span>
              <span className='p-1 font-medium text-[12px]'>x {cart.quantity} sản phẩm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
