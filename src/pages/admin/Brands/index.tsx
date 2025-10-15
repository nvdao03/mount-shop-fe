import { Link } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import { useInfiniteQuery } from '@tanstack/react-query'
import useQueryParams from '../../../hooks/useQueryParams'
import type { BrandQueryParamConfig } from '../../../configs/brand.config'
import { adminBrandApi } from '../../../apis/admin/brand.api'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { BrandType } from '../../../types/brand.type'
import { useState } from 'react'
import useDebounce from '../../../hooks/useDebounce'

export default function Brands() {
  const [search, setSearch] = useState<string>('')
  const debounceSearch = useDebounce(search, 500)

  const queryParams: BrandQueryParamConfig = useQueryParams()
  const queryConfig: BrandQueryParamConfig = {
    limit: queryParams.limit || 30,
    page: queryParams.page || 1,
    search: queryParams.search || debounceSearch
  }

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

  const { data, fetchNextPage, hasNextPage } = getBrands
  const brands = data?.pages.flatMap((page) => page.data.data.brands) || []

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Quản Lý Thương Hiệu
      </div>
      {/* --- Filter Categories --- */}
      <div id='scrollableDiv' className='p-4 h-[calc(100vh-120px)] overflow-y-scroll'>
        <div className='mb-4'>
          <div className='flex items-center justify-between'>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              value={search}
              type='text'
              placeholder='Tìm kiếm thuowng hiệu...'
              className='w-[80%] border rounded-lg px-4 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Link to={PATH.ADMIN_ADD_BRAND} className='bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-700'>
              + Thêm thương hiệu
            </Link>
          </div>
        </div>
        {/* --- Table Brands --- */}
        <div>
          <InfiniteScroll
            dataLength={brands.length}
            hasMore={!!hasNextPage}
            next={fetchNextPage}
            loader={<h4>Loading...</h4>}
            scrollableTarget='scrollableDiv'
          >
            <table className='w-full text-left border border-solid border-[#E6E6E6] rounded-[10px]'>
              <thead className='bg-gray-100 font-semibold'>
                <tr>
                  <th className='p-3 border border-solid border-[#E6E6E6] w-[10%]'>ID</th>
                  <th className='p-3 border border-solid border-[#E6E6E6] w-[30%]'>Tên danh mục</th>
                  <th className='p-3 border border-solid border-[#E6E6E6] text-center w-[30%]'>Ảnh</th>
                  <th className='p-3 border border-solid border-[#E6E6E6] text-center w-[25%]'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand: BrandType) => (
                  <tr key={brand.id}>
                    <td className='p-3 border border-solid border-[#E6E6E6] align-middle'>{brand.id}</td>
                    <td className='p-3 border border-solid border-[#E6E6E6] align-middle'>{brand.name}</td>
                    <td className='p-3 border border-solid border-[#E6E6E6] text-center'>
                      <div className='flex justify-center items-center'>
                        <img
                          src={brand.image}
                          className='w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200'
                        />
                      </div>
                    </td>
                    <td className='p-3 border border-solid border-[#E6E6E6] text-center align-middle text-white'>
                      <div className='flex items-center justify-center gap-3'>
                        <Link
                          to={`/admin/categories/update-brand/${brand.id}`}
                          className='bg-[#FFCA2C] hover:underline px-4 py-2 rounded-lg'
                        >
                          Sửa
                        </Link>
                        <button className='px-4 py-2 rounded-lg bg-[#BB2D3B] hover:underline'>Xóa</button>
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
