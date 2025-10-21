import ProductCard from '../../../../components/ProductCard'
import type { ProductType } from '../../../../types/product.type'
import SearchNoProduct from '../../../../assets/images/productList/search-no-product.png'
import SearchNoProductMobile from '../../../../assets/images/productList/search-no-product-mobile.png'
import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

interface PropTypes {
  // --- Variables --- //
  products: ProductType[]
  data: InfiniteData<AxiosResponse<any, any, {}>> | undefined
  hasNextPage: boolean | undefined
  isFetching: boolean
  totalResult: number
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<AxiosResponse<any, any, {}>, unknown>>

  // --- State and Set State --- //
  order: 'asc' | 'desc' | undefined
  setOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc' | undefined>>
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>

  // --- Functions --- //
  handleCollapse: () => void
}

export default function ProductListContent({
  products,
  data,
  hasNextPage,
  isFetching,
  order,
  totalResult,
  fetchNextPage,
  setOrder,
  setIsFilterOpen,
  handleCollapse
}: PropTypes) {
  return (
    <section className='col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-[10px] pb-7'>
      {/* Title */}
      <div className='flex justify-between items-center p-4 border-b border-solid border-[#E6E6E6]'>
        <div>
          <span className='text-[16px] md:text-[17px] font-semibold'>Kết quả cho: Isphone </span>
          <p className='mt-3 text-[#666] text-[14px]'>
            Đã tìm thấy <span className='text-primary font-semibold'>{totalResult}</span> kết quả
          </p>
        </div>
        {/* Sort Desktop */}
        <div className='hidden md:flex relative border border-solid border-primary rounded-lg'>
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setOrder(e.target.value === '' ? undefined : (e.target.value as 'asc' | 'desc'))
            }}
            className='appearance-none h-full flex-1 leading-[1.5] text-primary cursor-pointer font-semibold pl-4 pr-[35px] py-[10px] text-[14px] rounded-lg outline-none focus:ring-1 focus:border-primary '
          >
            <option value='' style={{ fontWeight: '600' }}>
              Sắp xếp theo
            </option>
            <option value='asc' style={{ fontWeight: '600' }}>
              Giá thấp - cao
            </option>
            <option value='desc' style={{ fontWeight: '600' }}>
              Giá cao - thấp
            </option>
          </select>
          <svg
            className='absolute top-1/2 right-[10px] transform -translate-y-1/2 pointer-events-none'
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='12'
            viewBox='0 0 18 12'
            fill='none'
          >
            <path
              d='M8.35263 10.7889L0.935291 3.37155C0.577559 3.01382 0.577559 2.43385 0.935291 2.07615L1.8004 1.21104C2.15753 0.853918 2.73632 0.853231 3.09428 1.20951L9.00035 7.08791L14.9064 1.20951C15.2643 0.853231 15.8431 0.853918 16.2002 1.21104L17.0654 2.07615C17.4231 2.43388 17.4231 3.01386 17.0654 3.37155L9.64806 10.7889C9.29033 11.1466 8.71036 11.1466 8.35263 10.7889Z'
              fill='#4F46E5'
            />
          </svg>
        </div>
        {/* Filer tablet / mobile */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className='md:hidden flex items-center gap-2 border border-solid border-primary rounded-lg text-[14px] font-semibold text-primary p-3'
        >
          <span>Bộ lọc</span>
          <svg xmlns='http://www.w3.org/2000/svg' width='14' height='15' viewBox='0 0 14 15' fill='none'>
            <path
              d='M13.0407 0.833374H0.958734C0.403578 0.833374 0.123448 1.50697 0.516807 1.90033L5.333 6.71725V12.0834C5.333 12.2873 5.43251 12.4784 5.59959 12.5954L7.68293 14.0532C8.09394 14.3409 8.66634 14.0493 8.66634 13.5412V6.71725L13.4827 1.90033C13.8752 1.50775 13.597 0.833374 13.0407 0.833374Z'
              fill='#4F46E5'
            />
          </svg>
        </button>
      </div>
      {/* Filter Mobile Price asc / desc */}
      <div className='md:hidden text-[14px] px-4 py-3 flex items-center gap-4'>
        <button
          onClick={() => setOrder('desc')}
          className={`${order === 'desc' && 'bg-primary border-primary text-white'} py-2 px-3 border border-solid font-medium border-[#1A1A1A] rounded-full`}
        >
          Giá cao - thấp
        </button>
        <button
          onClick={() => setOrder('asc')}
          className={`${order === 'asc' && 'bg-primary border-primary text-white'} py-2 px-3 border border-solid font-medium border-[#1A1A1A] rounded-full`}
        >
          Giá thấp - cao
        </button>
      </div>
      {/* Products */}
      {products.length > 0 ? (
        <div className='px-4 mt-2 md:mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-7'>
          {products.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className='h-[calc(100vh-220px)] flex justify-center items-center text-center'>
          <div>
            <picture className='text-center flex justify-center items-center'>
              <source media='(min-width: 768px)' srcSet={SearchNoProduct} />
              <img src={SearchNoProductMobile} alt='' />
            </picture>
            <div className='flex flex-col'>
              <span className='font-semibold md:text-[18px]'>Không có kết quả tìm kiếm</span>
              <span className='text-[#666] text-[14px] mt-4'>Vui lòng thử lại với từ khóa hoặc bộ lọc khác</span>
            </div>
          </div>
        </div>
      )}
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
        {!hasNextPage && (data?.pages.length as number) > 1 && (
          <button
            onClick={handleCollapse}
            className='text-primary border border-solid border-primary rounded-md py-3 px-4 font-semibold'
          >
            {isFetching ? 'Đang tải...' : 'Đóng lại'}
          </button>
        )}
      </div>
    </section>
  )
}
