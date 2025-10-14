import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { banners, bannersMobile } from '../../../../../data/home'
import { useEffect, useState } from 'react'

export default function HomeBannerSlider() {
  const [isDesktop, setIsDektop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => setIsDektop(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderButton = () => (
    <>
      <button className='absolute button-prev z-10 bg-white flex items-center justify-center rounded-full w-[40px] left-[1%] top-[calc(50%-50px)] translate-x-[0] -translate-y-[calc(50%-30px)] sm:-translate-y-[calc(50%-40px)] h-[40px]'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path
            d='M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z'
            fill='#1A1A1A'
          />
        </svg>
      </button>
      <button className='absolute z-10 button-next bg-white flex items-center justify-center rounded-full w-[40px] right-[1%] top-[calc(50%-50px)] translate-x-[0] -translate-y-[calc(50%-30px)] sm:-translate-y-[calc(50%-40px)] h-[40px]'>
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
    <section className='w-full bg-white pt-[96px] md:pt-[117px]'>
      <div className='max-w-7xl mx-auto px-4 relative'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 2800, disableOnInteraction: false }}
          navigation={{ nextEl: '.button-next', prevEl: '.button-prev' }}
        >
          {isDesktop &&
            banners.map((banner, index) => (
              <SwiperSlide key={index} className='relative !grid grid-cols-2 gap-x-5 pb-[40px] rounded-2xl'>
                <div className='hidden md:block rounded-2xl'>
                  <img src={banner.left} alt='Banner Left' className='w-full block h-full rounded-2xl object-cover' />
                </div>
                <div className='rounded-2xl'>
                  <img src={banner.right} alt='Banner Right' className='w-full block h-full rounded-2xl object-cover' />
                </div>
                {/* Button điều hướng */}
                {renderButton()}
              </SwiperSlide>
            ))}
          {!isDesktop &&
            bannersMobile.map((item, index) => (
              <SwiperSlide key={index} className='relative !grid grid-cols-1 gap-x-5 pb-[40px] rounded-2xl'>
                <div className='rounded-2xl'>
                  <img src={item.branner} alt='Banner Left' className='w-full block h-full rounded-2xl object-cover' />
                </div>
                {/* Button điều hướng */}
                {renderButton()}
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  )
}
