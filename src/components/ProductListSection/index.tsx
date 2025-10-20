import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { productApi } from '../../apis/shared/product.api'
import type { ProductType } from '../../types/product.type'
import ProductCard from '../ProductCard'

interface PropTypes {
  title: string
  background?: string
  option?: boolean
}

export default function ProductListSection({ title, background, option }: PropTypes) {
  const [isDesktop, setIsMobile] = useState(window.innerWidth >= 1024)

  const getProductFlashSale = useQuery({
    queryKey: ['getProductListSection'],
    queryFn: () => productApi.getProducts({ page: 1, limit: 15 }),
    staleTime: 30 * 60 * 1000
  })

  useEffect(() => {}, [getProductFlashSale.data?.data])

  const products =
    (getProductFlashSale?.data?.data && (getProductFlashSale.data.data.data.products as ProductType[])) || []

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderButton = () => (
    <>
      <button className='absolute hidden lg:flex button-prev z-10 bg-white [box-shadow:0_0_4px_0_rgba(0,_0,_0,_0.25)] items-center justify-center rounded-full w-[40px] left-0 top-[calc(50%-50px)] translate-x-[0] -translate-y-[calc(50%-30px)] sm:-translate-y-[calc(50%-40px)] h-[40px]'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path
            d='M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z'
            fill='#1A1A1A'
          />
        </svg>
      </button>
      <button className='absolute hidden lg:flex z-10 button-next bg-white [box-shadow:0_0_4px_0_rgba(0,_0,_0,_0.25)] items-center justify-center rounded-full w-[40px] right-0 top-[calc(50%-50px)] translate-x-[0] -translate-y-[calc(50%-30px)] sm:-translate-y-[calc(50%-40px)] h-[40px]'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path
            d='M8.29492 16.59L12.8749 12L8.29492 7.41L9.70492 6L15.7049 12L9.70492 18L8.29492 16.59Z'
            fill='#1A1A1A'
          />
        </svg>
      </button>
    </>
  )

  return (
    <section className={`${background ? `bg-[${background}]` : 'bg-[#D5D2F9] '} ${option && 'mt-2'}  py-5 md:py-10`}>
      <div className='max-w-7xl mx-auto px-4 relative'>
        <h1 className={`custom_title_h2 ${!background && 'text-primary'} !font-bold mb-4 sm:mb-7`}>{title}</h1>
      </div>
      {isDesktop && (
        <div className='relative max-w-7xl mx-auto px-4'>
          <Swiper
            className='relative'
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            navigation={{ nextEl: '.button-next', prevEl: '.button-prev' }}
          >
            {Array.from({ length: Math.ceil(products.length / 5) }).map((_, index) => {
              const start = index * 5
              const end = start + 5
              const group = products.slice(start, end)
              return (
                <SwiperSlide key={index}>
                  <div className='grid grid-cols-5 gap-6 py-1'>
                    {group.map((product: ProductType) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
          {renderButton()}
        </div>
      )}
      {!isDesktop && (
        <div
          className='overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide'
          style={{ scrollbarWidth: 'none' }}
        >
          {/* tạo padding 2 bên bằng wrapper riêng */}
          <div className='flex gap-4 px-4 snap-x snap-mandatory'>
            {products.map((product: ProductType) => (
              <div key={product.id} className='h-full snap-start shrink-0 w-[47%] sm:w-[30%] md:w-[22%]'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
