import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { productApi } from '../../../../../apis/shared/product.api'

export default function HomeFlashSale() {
  const queryClient = useQueryClient()
  const [isMobile, setIsMobile] = useState(window.innerWidth >= 640)
  // const [products, setProducts]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth >= 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // useEffect(() => {
  //   const loadProduct = async () => {
  //     const data = await queryClient.fetchQuery({
  //       queryKey: ['getProducts'],
  //       queryFn: (params: { limit: string; page: string }) => productApi.getProducts(params),
  //       staleTime: 30 * 60 * 1000,
  //       cacheTime: 30 * 60 * 1000
  //     })
  //   }
  // }, [queryClient])

  return (
    <section className='bg-[#D5D2F9]'>
      <div className='max-w-7xl mx-auto px-4 relative py-5 md:py-10'>
        <h1 className='custom_title_h2 text-primary !font-bold mb-4 sm:mb-7'>Deal chớp nhoáng</h1>
      </div>
    </section>
  )
}
