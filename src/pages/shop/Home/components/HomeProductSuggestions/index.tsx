import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { CategoryType } from '../../../../../types/category.type'
import { categoryApi } from '../../../../../apis/shared/category.api'
import useQueryParams from '../../../../../hooks/useQueryParams'
import type { ProductQueryParamsConfig } from '../../../../../configs/product.config'
import { productApi } from '../../../../../apis/shared/product.api'
import type { ProductType } from '../../../../../types/product.type'
import ProductCard from '../../../../../components/ProductCard'

export default function HomeProductSuggestions() {
  const queryClient = useQueryClient()
  const queryParams: ProductQueryParamsConfig = useQueryParams()

  const [categories, setCategories] = useState<CategoryType[] | []>([])
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const excludedCategories = ['Máy giặt', 'Tủ lạnh', 'Nhà sách', 'Âm thanh', 'Túi xách']
  const queryConfig: ProductQueryParamsConfig = {
    page: queryParams.page || 1,
    limit: !isMobile ? 15 : 6,
    category: queryParams.category || (categoryId as number) || undefined
  }

  // --- Resize screen --- //
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  // --- Get Categpories data cache --- //
  useEffect(() => {
    const getCategories = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['getCategories'],
        queryFn: () => categoryApi.getCategories(),
        staleTime: 30 * 60 * 1000
      })
      const categoryList = data.data.data.categories as CategoryType[]
      categoryList.forEach((category: CategoryType) => {
        if (category.name === 'TV') {
          setCategoryId(category.id)
          return
        }
      })
      setCategories(categoryList)
    }
    getCategories()
  }, [])

  // --- Get Products --- //
  const getProducts = useInfiniteQuery({
    queryKey: ['getProductsPageHome', queryConfig],
    queryFn: ({ pageParam = queryConfig.page }) => productApi.getProducts({ ...queryConfig, page: pageParam }),
    keepPreviousData: true,
    staleTime: 30 * 60 * 1000,
    enabled: !!categoryId,
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  // --- Handle Reset and cached data page 1 --- //
  const handleReset = () => {
    const cachedData = queryClient.getQueryData<any>(['getProductsPageHome', queryConfig])
    if (cachedData) {
      queryClient.setQueryData(['getProductsPageHome', queryConfig], {
        ...cachedData,
        pages: [cachedData.pages[0]]
      })
    }
  }

  const { isFetching, hasNextPage, fetchNextPage } = getProducts
  const products = getProducts.data?.pages.flatMap((page) => page.data.data.products) || []

  return (
    <section className='pt-[20px] py-6 md:py-10 bg-white'>
      <div className='max-w-7xl mx-auto px-4 relative'>
        {/* Filter */}
        <div className='flex gap-5 flex-col md:flex-row md:items-center'>
          <h2 className='custom_title_h2 flex-shrink-0'>Gợi ý dành cho bạn</h2>
          <div
            className='w-full md:w-auto overflow-x-auto scroll-smooth scrollbar-hide flex items-center gap-3 snap-x'
            style={{ scrollbarWidth: 'none' }}
          >
            {categories
              .filter((category: CategoryType) => !excludedCategories.includes(category.name))
              .map((category: CategoryType) => (
                <button
                  onClick={() => setCategoryId(category.id)}
                  key={category.id}
                  className={`${categoryId === category.id ? 'bg-primary text-white border-primary' : 'bg-white'} snap-start flex-shrink-0 snap-mandatory px-3 py-3 md:px-4 md:py-3 text-[14px] font-semibold rounded-full outline-none border border-solid border-[#1A1A1A]`}
                >
                  {category.name === 'Thời trang' ? 'Thời trang nam-nữ' : category.name}
                </button>
              ))}
          </div>
        </div>
        {/* Products */}
        <div className='mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-10'>
          {products.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {/* Pagination */}
        <div className='flex justify-center items-center'>
          {hasNextPage && (
            <button
              onClick={() => {
                fetchNextPage()
              }}
              className='text-primary border border-solid border-primary rounded-md py-3 px-4 font-semibold'
            >
              {isFetching ? 'Đang tải...' : 'Xem thêm'}
            </button>
          )}
          {!hasNextPage && (
            <button
              onClick={handleReset}
              className='text-primary border border-solid border-primary rounded-md py-3 px-4 font-semibold'
            >
              {isFetching ? 'Đang tải...' : 'Đóng lại'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
