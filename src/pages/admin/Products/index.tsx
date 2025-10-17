import { Link } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import useQueryParams from '../../../hooks/useQueryParams'
import type { ProductQueryParamsConfig } from '../../../configs/product.config'
import { useInfiniteQuery } from '@tanstack/react-query'
import { productApi } from '../../../apis/shared/product.api'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { ProductType } from '../../../types/product.type'
import { formatCurrency } from '../../../utils/other'

export default function Products() {
  const queryParams: ProductQueryParamsConfig = useQueryParams()
  const queryConfig: ProductQueryParamsConfig = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 15,
    category: queryParams.category,
    search: queryParams.search || ''
  }

  // --- Get Products --- //
  const getProducts = useInfiniteQuery({
    queryKey: ['adminGetProducts', queryConfig],
    queryFn: ({ pageParam = queryConfig.page }) =>
      productApi.getProducts({
        page: pageParam,
        ...queryConfig
      }),
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    },
    staleTime: 30 * 60 * 1000
  })

  const { data, fetchNextPage, hasNextPage } = getProducts
  const products = data?.pages.flatMap((page) => page.data.data.products) || []

  return (
    <div className='h-full bg-white'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Quản Lý Sản Phẩm
      </div>
      {/* --- Filter Products --- */}
      <div id='scrollableDiv' className='py-4 h-[calc(100vh-120px)] overflow-y-scroll'>
        <div className='mb-4 px-4'>
          <div className='flex items-center justify-between'>
            <input
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              // value={search}
              type='text'
              placeholder='Tìm kiếm sản phẩm...'
              className='w-[80%] border rounded-lg px-4 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Link to={PATH.ADMIN_ADD_PRODUCT} className='bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-700'>
              + Thêm sản phẩm
            </Link>
          </div>
        </div>
        {/* --- Table Products --- */}
        <div className=''>
          <InfiniteScroll
            dataLength={products.length}
            hasMore={!!hasNextPage}
            next={fetchNextPage}
            loader={<h4>Loading...</h4>}
            scrollableTarget='scrollableDiv'
            className='py-4 h-[calc(100vh-120px)] overflow-y-scroll scrollbar-hide'
          >
            <table className='w-full text-left  border-solid border-[#E6E6E6] rounded-[10px]'>
              <thead className='font-semibold'>
                <tr>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[10%]'>ID</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[40%]'>Tên sản phẩm</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[20%]'>Hình ảnh</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[10%]'>Giá bán</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[20%]'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: ProductType, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? 'bg-[#F9F9F9]' : ''}>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{product.id}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>
                      <div className='line-clamp-3 leading-[1.5] py-2 text-[14px]'>{product.name}</div>
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center'>
                      <div className='flex justify-center items-center h-full rounded-[10px]'>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='max-h-[80px] py-2 w-auto object-contain rounded-[10px] shadow-sm border border-gray-200'
                        />
                      </div>
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle truncate ml-1'>
                      <span>{formatCurrency(product.price)}</span>
                      <span className='text-[13px] ml-[2px]'>₫</span>
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center align-middle text-white'>
                      <div className='flex items-center justify-center gap-3'>
                        <Link to={`/admin/products/update-product/${product.id}`}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={22}
                            height={22}
                            viewBox='0 0 25 24'
                            fill='none'
                          >
                            <path
                              d='M11.625 4H4.625C4.09457 4 3.58586 4.21071 3.21079 4.58579C2.83571 4.96086 2.625 5.46957 2.625 6V20C2.625 20.5304 2.83571 21.0391 3.21079 21.4142C3.58586 21.7893 4.09457 22 4.625 22H18.625C19.1554 22 19.6641 21.7893 20.0392 21.4142C20.4143 21.0391 20.625 20.5304 20.625 20V13'
                              stroke='#624DE3'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M19.125 2.50001C19.5228 2.10219 20.0624 1.87869 20.625 1.87869C21.1876 1.87869 21.7272 2.10219 22.125 2.50001C22.5228 2.89784 22.7463 3.4374 22.7463 4.00001C22.7463 4.56262 22.5228 5.10219 22.125 5.50001L12.625 15L8.625 16L9.625 12L19.125 2.50001Z'
                              stroke='#624DE3'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </Link>
                        <button>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={22}
                            height={22}
                            viewBox='0 0 25 24'
                            fill='none'
                          >
                            <path
                              d='M3.625 6H5.625H21.625'
                              stroke='#A30D11'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M8.625 6V4C8.625 3.46957 8.83571 2.96086 9.21079 2.58579C9.58586 2.21071 10.0946 2 10.625 2H14.625C15.1554 2 15.6641 2.21071 16.0392 2.58579C16.4143 2.96086 16.625 3.46957 16.625 4V6M19.625 6V20C19.625 20.5304 19.4143 21.0391 19.0392 21.4142C18.6641 21.7893 18.1554 22 17.625 22H7.625C7.09457 22 6.58586 21.7893 6.21079 21.4142C5.83571 21.0391 5.625 20.5304 5.625 20V6H19.625Z'
                              stroke='#A30D11'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M10.625 11V17'
                              stroke='#A30D11'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M14.625 11V17'
                              stroke='#A30D11'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </button>
                        <Link to={`/admin/products/product-detail/${product.id}`}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={22}
                            height={22}
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M12 8.11103C11.632 8.11679 11.2667 8.17525 10.9153 8.28465C11.0778 8.57052 11.1644 8.8933 11.1667 9.22215C11.1667 9.4775 11.1164 9.73034 11.0187 9.96626C10.9209 10.2022 10.7777 10.4165 10.5971 10.5971C10.4166 10.7776 10.2022 10.9209 9.96632 11.0186C9.73041 11.1163 9.47757 11.1666 9.22222 11.1666C8.89336 11.1643 8.57059 11.0778 8.28471 10.9152C8.05917 11.6974 8.08546 12.5308 8.35985 13.2972C8.63425 14.0637 9.14284 14.7244 9.8136 15.1857C10.4843 15.6471 11.2832 15.8857 12.0971 15.8677C12.911 15.8498 13.6987 15.5762 14.3484 15.0858C14.9982 14.5954 15.4772 13.9129 15.7176 13.1351C15.958 12.3573 15.9475 11.5236 15.6877 10.7521C15.428 9.98058 14.932 9.31034 14.2702 8.83633C13.6083 8.36233 12.8141 8.10858 12 8.11103ZM21.8792 11.493C19.9962 7.81902 16.2684 5.33325 12 5.33325C7.73159 5.33325 4.00276 7.82076 2.12081 11.4933C2.04138 11.6505 2 11.824 2 12.0001C2 12.1762 2.04138 12.3498 2.12081 12.5069C4.0038 16.1808 7.73159 18.6666 12 18.6666C16.2684 18.6666 19.9972 16.1791 21.8792 12.5065C21.9586 12.3494 22 12.1758 22 11.9998C22 11.8237 21.9586 11.6501 21.8792 11.493ZM12 16.9999C8.57465 16.9999 5.43436 15.0902 3.73853 11.9999C5.43436 8.90965 8.5743 6.99992 12 6.99992C15.4257 6.99992 18.5656 8.90965 20.2615 11.9999C18.566 15.0902 15.4257 16.9999 12 16.9999Z'
                              fill='#4F46E5'
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}
