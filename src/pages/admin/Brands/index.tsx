import { Link } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useQueryParams from '../../../hooks/useQueryParams'
import type { BrandQueryParamConfig } from '../../../configs/brand.config'
import { adminBrandApi } from '../../../apis/admin/brand.api'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { BrandType } from '../../../types/brand.type'
import { useState } from 'react'
import useDebounce from '../../../hooks/useDebounce'
import { toast } from 'react-toastify'
import { BRAND_MESSAGE } from '../../../constants/message'

export default function Brands() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState<string>('')
  const debounceSearch = useDebounce(search, 500)

  const queryParams: BrandQueryParamConfig = useQueryParams()
  const queryConfig: BrandQueryParamConfig = {
    limit: queryParams.limit || 15,
    page: queryParams.page || 1,
    search: queryParams.search || debounceSearch
  }

  // --- Get Brands --- //
  const getBrands = useInfiniteQuery({
    queryKey: ['adminGetBrands', queryConfig],
    queryFn: ({ pageParam = queryConfig.page }) =>
      adminBrandApi.getBrands({
        page: pageParam,
        limit: queryConfig.limit,
        search: queryConfig.search
      }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    },
    staleTime: 30 * 60 * 1000
  })

  // --- Delete Brand Mutation --- //
  const deleteBrandMutation = useMutation({
    mutationFn: (brand_id: number) => adminBrandApi.deleteBrand(brand_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminGetBrands'])
      queryClient.invalidateQueries(['getBrandsByCategoryId'])
      toast.success(BRAND_MESSAGE.DELETE_BRAND_SUCCESS)
    }
  })

  const { data, fetchNextPage, hasNextPage } = getBrands
  const brands = data?.pages.flatMap((page) => page.data.data.brands) || []

  return (
    <div className='h-full bg-white'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Quản Lý Thương Hiệu
      </div>
      {/* --- Filter Brands --- */}
      <div id='scrollableDiv' className='py-4 h-[calc(100vh-120px)] overflow-y-scroll'>
        <div className='mb-4 px-4'>
          <div className='flex items-center justify-between'>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              value={search}
              type='text'
              placeholder='Tìm kiếm thương hiệu...'
              className='w-[80%] border rounded-lg px-4 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Link to={PATH.ADMIN_ADD_BRAND} className='bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-700'>
              + Thêm thương hiệu
            </Link>
          </div>
        </div>
        {/* --- Table Brands --- */}
        <div className=''>
          <InfiniteScroll
            dataLength={brands.length}
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
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[30%]'>Tên danh mục</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[30%]'>Hình ảnh</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[25%]'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand: BrandType, index) => (
                  <tr key={brand.id} className={index % 2 === 0 ? 'bg-[#F9F9F9]' : ''}>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{brand.id}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{brand.name}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center'>
                      <div className='flex justify-center items-center'>
                        <img
                          src={brand.image}
                          className='w-14 h-14 py-1 object-contain rounded-md shadow-sm border border-gray-200'
                        />
                      </div>
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center align-middle text-white'>
                      <div className='flex items-center justify-center gap-3'>
                        <Link to={`/admin/brands/update-brand/${brand.id}`}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='22'
                            height='22'
                            viewBox='0 0 25 24'
                            fill='none'
                          >
                            <path
                              d='M11.625 4H4.625C4.09457 4 3.58586 4.21071 3.21079 4.58579C2.83571 4.96086 2.625 5.46957 2.625 6V20C2.625 20.5304 2.83571 21.0391 3.21079 21.4142C3.58586 21.7893 4.09457 22 4.625 22H18.625C19.1554 22 19.6641 21.7893 20.0392 21.4142C20.4143 21.0391 20.625 20.5304 20.625 20V13'
                              stroke='#624DE3'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                            <path
                              d='M19.125 2.50001C19.5228 2.10219 20.0624 1.87869 20.625 1.87869C21.1876 1.87869 21.7272 2.10219 22.125 2.50001C22.5228 2.89784 22.7463 3.4374 22.7463 4.00001C22.7463 4.56262 22.5228 5.10219 22.125 5.50001L12.625 15L8.625 16L9.625 12L19.125 2.50001Z'
                              stroke='#624DE3'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </Link>
                        <button onClick={() => deleteBrandMutation.mutate(brand.id)}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='22'
                            height='22'
                            viewBox='0 0 25 24'
                            fill='none'
                          >
                            <path
                              d='M3.625 6H5.625H21.625'
                              stroke='#A30D11'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                            <path
                              d='M8.625 6V4C8.625 3.46957 8.83571 2.96086 9.21079 2.58579C9.58586 2.21071 10.0946 2 10.625 2H14.625C15.1554 2 15.6641 2.21071 16.0392 2.58579C16.4143 2.96086 16.625 3.46957 16.625 4V6M19.625 6V20C19.625 20.5304 19.4143 21.0391 19.0392 21.4142C18.6641 21.7893 18.1554 22 17.625 22H7.625C7.09457 22 6.58586 21.7893 6.21079 21.4142C5.83571 21.0391 5.625 20.5304 5.625 20V6H19.625Z'
                              stroke='#A30D11'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                            <path
                              d='M10.625 11V17'
                              stroke='#A30D11'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                            <path
                              d='M14.625 11V17'
                              stroke='#A30D11'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </button>
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
