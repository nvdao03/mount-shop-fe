import { Link } from 'react-router-dom'
import type { ProductType } from '../../types/product.type'
import { fomatNumberToSocialStyle, formatCurrency } from '../../utils/other'
import ProductRating from '../ProductRating'
import { useEffect, useState } from 'react'

interface PropTypes {
  product: ProductType
}

export default function ProductCard({ product }: PropTypes) {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Link to={`/product-detail/${product.id}`} className='h-full'>
      <div className='bg-white h-full flex border border-solid border-[#E0E0E0] flex-col overflow-hidden shadow rounded-md hover:translate-y-[0.05rem] hover:shadow-md duration-300 transition-transform'>
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
            {isMobile ? (
              <div className='flex items-center gap-1'>
                <svg viewBox='0 0 9.5 8' className='w-3 h-3'>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset={0} stopColor='#ffca11' />
                      <stop offset={1} stopColor='#ffad27' />
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    />
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <div className='flex items-center'>
                  <span>{product.rating}</span>
                  <span>/</span>
                  <span>5</span>
                </div>
              </div>
            ) : (
              Number(product.rating) > 0 && <ProductRating rating={Number(product.rating)} />
            )}
            <div className='flex items-center gap-x-1 leading-[0] ml-auto sm:ml-0'>
              <span className='block sm:w-auto leading-[1.5] truncate'>
                Đã bán {fomatNumberToSocialStyle(product.sold)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
