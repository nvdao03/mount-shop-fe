import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CategoryQueryParamsConfig } from '../../../configs/category.config'
import useQueryParams from '../../../hooks/useQueryParams'
import { categoryApi } from '../../../apis/shared/category.api'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import type { CategoryType } from '../../../types/category.type'
import InfiniteScroll from 'react-infinite-scroll-component'
import useDebounce from '../../../hooks/useDebounce'
import { adminCategoryApi } from '../../../apis/admin/category.api'
import { toast } from 'react-toastify'
import { CATEGORY_MESSAGE } from '../../../constants/message'

export default function Categories() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('')
  const debounceSearch = useDebounce(search, 500)

  const queryParams: CategoryQueryParamsConfig = useQueryParams()
  const queryConfig: CategoryQueryParamsConfig = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 30,
    search: queryParams.search || debounceSearch
  }

  // --- Get Categories --- //
  const getCategories = useInfiniteQuery({
    queryKey: ['adminGetCategories', queryConfig],
    queryFn: ({ pageParam = queryConfig.page }) =>
      categoryApi.getCategories({
        page: pageParam,
        limit: queryConfig.limit,
        search: queryConfig.search
      }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  // --- Delete Category Mutation --- //
  const deleteCategoryMutation = useMutation({
    mutationFn: (category_id: number) => adminCategoryApi.deleteCategory(category_id),
    onSuccess: () => {
      ;(toast.success(CATEGORY_MESSAGE.DELETE_CATEGORY_SUCCESS), queryClient.invalidateQueries(['adminGetCategories']))
      queryClient.invalidateQueries(['getCategories'])
      navigate(PATH.ADMIN_CATEGORIES)
    }
  })

  const { data, hasNextPage, fetchNextPage } = getCategories
  const categories = data?.pages.flatMap((page) => page.data.data.categories) || []

  return (
    <div className='h-full'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Quản Lý Danh Mục
      </div>
      {/* --- Filter Categories --- */}
      <div id='scrollableDiv' className='p-4 h-[calc(100vh-120px)] overflow-y-scroll'>
        <div className='mb-4'>
          <div className='flex items-center justify-between'>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              value={search}
              type='text'
              placeholder='Tìm kiếm danh mục...'
              className='w-[80%] border rounded-lg px-4 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Link to={PATH.ADMIN_ADD_CATEGORY} className='bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-700'>
              + Thêm danh mục
            </Link>
          </div>
        </div>
        {/* --- Table Categories --- */}
        <div>
          <InfiniteScroll
            dataLength={categories.length}
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
                {categories.map((category: CategoryType) => (
                  <tr key={category.id}>
                    <td className='p-3 border border-solid border-[#E6E6E6] align-middle'>{category.id}</td>
                    <td className='p-3 border border-solid border-[#E6E6E6] align-middle'>{category.name}</td>
                    <td className='p-3 border border-solid border-[#E6E6E6] text-center'>
                      <div className='flex justify-center items-center'>
                        <img
                          src={category.image}
                          className='w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200'
                        />
                      </div>
                    </td>
                    <td className='p-3 border border-solid border-[#E6E6E6] text-center align-middle text-white'>
                      <div className='flex items-center justify-center gap-3'>
                        <Link
                          to={`/admin/categories/update-category/${category.id}`}
                          className='bg-[#FFCA2C] hover:underline px-4 py-2 rounded-lg'
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                          className='px-4 py-2 rounded-lg bg-[#BB2D3B] hover:underline'
                        >
                          Xóa
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
