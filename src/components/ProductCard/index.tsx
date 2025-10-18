import { Link } from 'react-router-dom'
import type { ProductType } from '../../types/product.type'
import { fomatNumberToSocialStyle, formatCurrency } from '../../utils/other'
import ProductRating from '../ProductRating'

interface PropTypes {
  product: ProductType
}

export default function ProductCard({ product }: PropTypes) {
  return (
    <Link to={`/product-detail/${product.id}`} className='h-full'>
      <div className='bg-white h-full flex  border border-solid border-[#E0E0E0] flex-col overflow-hidden shadow rounded-md hover:translate-y-[0.05rem] hover:shadow-md duration-300 transition-transform'>
        {/* image */}
        <div className='w-full relative pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
          />
        </div>
        {/* Content */}
        <div className='py-[20px] px-2 overflow-hidden h-full flex flex-col'>
          {/* title */}
          <h4 className='line-clamp-2 text-[14px] leading-[1.5]'>{product.name}</h4>
          {/* Price */}
          <div className='flex items-center gap-[6px] mt-3'>
            {product.price_before_discount > 0 && (
              <div className='line-through text-xs max-w-[50%] text-gray-500 truncate'>
                <span>{formatCurrency(product.price_before_discount)}</span>
                <span>₫</span>
              </div>
            )}
            <div className='text-primary truncate'>
              <span>{formatCurrency(product.price)}</span>
              <span className='text-[13px]'>₫</span>
            </div>
          </div>
          {/* quantity */}
          <div
            className={
              Number(product.rating) > 0
                ? 'mt-4 flex items-center gap-x-2 text-[12px]'
                : 'flex items-center gap-x-2 text-[12px] mt-4'
            }
          >
            {Number(product.rating) > 0 && <ProductRating rating={Number(product.rating)} />}
            <div className='flex items-center gap-x-1 leading-[0]'>
              <span className='leading-[1.5]'>Đã bán</span>
              <span>{fomatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
