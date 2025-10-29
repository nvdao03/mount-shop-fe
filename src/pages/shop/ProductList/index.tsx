import { useEffect, useState } from 'react'
import type { ProductQueryParamsConfig } from '../../../configs/product.config'
import { useLocation } from 'react-router-dom'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../../../apis/shared/product.api'
import type { ProductType } from '../../../types/product.type'
import { categoryApi } from '../../../apis/shared/category.api'
import type { BrandType } from '../../../types/brand.type'
import { toast } from 'react-toastify'
import { PRODUCT_MESSAGE } from '../../../constants/message'
import ProductListFilterSidebar from './ProductListFilterSidebar'
import ProductListContent from './ProductListContent'
import ProductListFilterMobileDrawer from './ProductListFilterMobileDrawer'

export default function ProductList() {
  const queryClient = useQueryClient()
  const location = useLocation()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [rating, setRating] = useState<number | undefined>(undefined)
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [minPriceInput, setMinPriceInput] = useState<string>('')
  const [maxPriceInput, setMaxPriceInput] = useState<string>('')
  const [checkPriceLevel, setCheckPriceLevel] = useState<number | undefined>(undefined)
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>(undefined)
  const [brandIds, setBrandIds] = useState<number[]>([])
  const [search, setSearch] = useState<string>('')
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640)
  let totalResult = 0

  const stateQuery: ProductQueryParamsConfig = location.state.queryPageProducts || {}
  const queryConfig: ProductQueryParamsConfig = {
    ...stateQuery,
    page: 1,
    limit: isMobile ? 6 : 12,
    rating: rating,
    brands: brandIds,
    order: order,
    min_price: minPrice,
    max_price: maxPrice,
    search: search
  }

  // --- Get Products --- //
  const getProducts = useInfiniteQuery({
    queryKey: ['getProducts', queryConfig],
    queryFn: ({ pageParam = queryConfig.page }) =>
      productApi.getProducts({
        ...queryConfig,
        page: pageParam
      }),
    keepPreviousData: true,
    staleTime: 30 * 60 * 1000,
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      totalResult = pagination.total
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  // --- Get Brand By Category Id --- //
  const getBrands = useQuery({
    queryKey: ['getBrandsByCategoryId', queryConfig.category],
    queryFn: () => categoryApi.getBrandsByCategoryId(queryConfig.category as number),
    enabled: !!queryConfig.category,
    staleTime: 30 * 60 * 1000
  })

  // --- Xử lý lấy brands từ component header truyền xuống --- //
  useEffect(() => {
    if (stateQuery.brands) {
      const categoryArr = Array.isArray(stateQuery.brands)
        ? stateQuery.brands.map((id) => Number(id))
        : [Number(stateQuery.brands)]
      setBrandIds((prev) => [...prev, ...categoryArr])
    }
  }, [stateQuery.brands])

  // --- Xử lý lấy search từ component header truyền xuống --- //
  useEffect(() => {
    if (!stateQuery.search) return
    if (stateQuery.search) {
      setSearch(stateQuery.search)
    }
  }, [stateQuery.search])

  // --- Chặn cuộn body khi mở modal ---
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFilterOpen])

  // --- Handle Resize Screen --- //
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  // --- Xử lý cuộn nên đầu trang khi F5 --- //
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0)
    }
    // beforeunload nó sẽ reset vị trị scroll trên trang và load nên đầu trang
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // --- Handle Collapse and Cached data page 1 and scroll to top --- //
  const handleCollapse = () => {
    const cachedData = queryClient.getQueryData<any>(['getProducts', queryConfig])
    if (cachedData) {
      queryClient.setQueryData(['getProducts', queryConfig], {
        ...cachedData,
        pages: [cachedData.pages[0]]
      })
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // --- Handle Apply Price --- //
  const handleApplyPrice = () => {
    const min = Number(minPriceInput)
    const max = Number(maxPriceInput)
    if (minPriceInput.trim() === '' && maxPriceInput.trim() === '') {
      setCheckPriceLevel(undefined)
      setMinPrice(undefined)
      setMaxPrice(undefined)
      return
    }
    const finalMin = minPriceInput.trim() === '' ? undefined : min
    const finalMax = maxPriceInput.trim() === '' ? undefined : max
    if (finalMin !== undefined && finalMax !== undefined && finalMin > finalMax) {
      toast.warning(PRODUCT_MESSAGE.MIN_PRICE_GREATER_THAN_MAX_PRICE)
      return
    }
    setMinPrice(finalMin)
    setMaxPrice(finalMax)
    setCheckPriceLevel(undefined)
  }

  // --- Function All Section Handle Filter Siderbar -- //
  const handleOnChangeInputPriceLevel = (item: {
    id: number
    idInput: string
    label: string
    minPrice: number
    maxPrice: number
  }) => {
    setCheckPriceLevel(item.id)
    setMinPriceInput('')
    setMaxPriceInput('')
    setMinPrice(item.minPrice)
    setMaxPrice(item.maxPrice)
  }

  const handleOnChangePriceLevelAll = () => {
    setCheckPriceLevel(undefined)
    setMinPrice(undefined)
    setMaxPrice(undefined)
  }

  const handleOnChangeInputRating = (e: React.ChangeEvent<HTMLInputElement>, ratingValue: number) => {
    if (e.target.checked) {
      setRating(ratingValue)
      queryConfig.category = ratingValue
    }
  }

  const handleOnChangeInputRatingAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setRating(undefined)
    }
  }

  const handleOnChangeInputBrand = (e: React.ChangeEvent<HTMLInputElement>, brand_id: number) => {
    if (e.target.checked) {
      setBrandIds((prev) => [...prev, brand_id])
    } else {
      setBrandIds((prev) => prev.filter((id) => id !== brand_id))
    }
  }

  const handleOnChangeInputBrandAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setBrandIds([])
    }
  }

  // --- Handle Reset Filter For Mobile --- //
  const handleResetFilterForMobile = () => {
    setRating(undefined)
    setIsFilterOpen(false)
    setBrandIds([])
    setOrder(undefined)
    setMinPriceInput('')
    setMaxPriceInput('')
    setMinPrice(undefined)
    setMaxPrice(undefined)
  }

  const { data, fetchNextPage, hasNextPage, isFetching } = getProducts
  const products = (data?.pages.flatMap((page) => page.data.data.products) as ProductType[]) || []
  const brands = (getBrands.data?.data && (getBrands.data.data.data.brands as BrandType[])) || []

  return (
    <main className='w-full pt-[96px] md:pt-[117px]'>
      <div className='max-w-7xl mx-auto px-4 grid grid-cols-12 gap-3 relative min-h-[500px] sm:min-h-[540px]'>
        {/* Sidebar */}
        <ProductListFilterSidebar
          brandIds={brandIds}
          brands={brands}
          checkPriceLevel={checkPriceLevel}
          rating={rating}
          search={search}
          handleOnChangePriceLevelAll={handleOnChangePriceLevelAll}
          setMaxPriceInput={setMaxPriceInput}
          setMinPriceInput={setMinPriceInput}
          handleOnChangeInputPriceLevel={handleOnChangeInputPriceLevel}
          handleApplyPrice={handleApplyPrice}
          handleOnChangeInputRatingAll={handleOnChangeInputRatingAll}
          handleOnChangeInputRating={handleOnChangeInputRating}
          handleOnChangeInputBrand={handleOnChangeInputBrand}
          handleOnChangeInputBrandAll={handleOnChangeInputBrandAll}
        />
        {/* Content */}
        <ProductListContent
          products={products}
          data={data}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          order={order}
          setOrder={setOrder}
          totalResult={totalResult}
          search={search}
          setIsFilterOpen={setIsFilterOpen}
          handleCollapse={handleCollapse}
        />
      </div>
      {/* --- Filter for mobile --- */}
      <ProductListFilterMobileDrawer
        brandIds={brandIds}
        brands={brands}
        checkPriceLevel={checkPriceLevel}
        handleApplyPrice={handleApplyPrice}
        handleOnChangeInputPriceLevel={handleOnChangeInputPriceLevel}
        handleOnChangePriceLevelAll={handleOnChangePriceLevelAll}
        handleResetFilterForMobile={handleResetFilterForMobile}
        isFilterOpen={isFilterOpen}
        rating={rating}
        search={search}
        setIsFilterOpen={setIsFilterOpen}
        setMaxPriceInput={setMaxPriceInput}
        setMinPriceInput={setMinPriceInput}
        handleOnChangeInputRatingAll={handleOnChangeInputRatingAll}
        handleOnChangeInputRating={handleOnChangeInputRating}
        handleOnChangeInputBrand={handleOnChangeInputBrand}
        handleOnChangeInputBrandAll={handleOnChangeInputBrandAll}
      />
    </main>
  )
}
