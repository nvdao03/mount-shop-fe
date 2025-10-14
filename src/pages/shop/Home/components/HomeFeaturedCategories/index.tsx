import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { categoryApi } from '../../../../../apis/shared/category.api'
import type { CategoryType } from '../../../../../types/category.type'
import { Link } from 'react-router-dom'

export default function HomeFeaturedCategories() {
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState<CategoryType[] | []>([])

  useEffect(() => {
    const loadCategories = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['getAllCategory'],
        queryFn: () => categoryApi.getAllCategories(),
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
              <Link key={category.id} to={''} className='relative'>
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
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
