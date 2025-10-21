import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { categoryApi } from '../../../../../apis/shared/category.api'
import type { CategoryType } from '../../../../../types/category.type'
import { useNavigate } from 'react-router-dom'
import { PATH } from '../../../../../constants/path'
import type { ProductQueryParamsConfig } from '../../../../../configs/product.config'

export default function HomeFeaturedCategories() {
  const queryPageProducts: ProductQueryParamsConfig = {}
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState<CategoryType[] | []>([])

  useEffect(() => {
    const loadCategories = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['getCategories'],
        queryFn: () => categoryApi.getCategories(),
        staleTime: 30 * 60 * 1000
      })
      setCategories(data.data.data.categories)
    }

    loadCategories()
  }, [queryClient])

  return (
    <section className='pt-[20px] md:pt-[40px] pb-7 bg-white'>
      <div className='max-w-7xl mx-auto px-4 relative'>
        <h2 className='text-[#1A1A1A] custom_title_h2'>Danh mục nổi bật</h2>
        <div className='mt-5 grid gap-x-4 gap-y-7 sm:mt-7 sm:gap-4 grid-cols-4 lg:grid-cols-5'>
          {categories &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  queryPageProducts.category = category.id
                  navigate(PATH.PRODUCT_LIST, {
                    state: {
                      queryPageProducts: queryPageProducts
                    }
                  })
                }}
                className='relative p-0 m-0 bg-transparent border-none outline-none appearance-none w-full text-left'
              >
                <div className='relative p-2 sm:p-4 bg-[#F5F5FA] rounded-lg'>
                  <span className='hidden mb-4 text-[15px] md:text-[16px] font-semibold sm:block'>{category.name}</span>
                  <div className='grid grid-cols-5'>
                    <div className='sm:col-span-1'></div>
                    <img src={category.image} alt={category.name} className='col-span-5 sm:col-start-2 sm:col-span-4' />
                  </div>
                </div>
                <span className='block sm:hidden text-[14px] text-center mt-2 w-full flex-wrap leading-[1.5]'>
                  {category.name}
                </span>
              </button>
            ))}
        </div>
      </div>
    </section>
  )
}
