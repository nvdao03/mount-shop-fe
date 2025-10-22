import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { CommentQueryParamsConfig } from '../../../configs/comment.config'
import useQueryParams from '../../../hooks/useQueryParams'
import { adminCommentApi } from '../../../apis/admin/comment.api'
import type { CommentType } from '../../../types/comment.type'
import AvatarDefault from '../../../assets/images/avatar-default.png'
import useDebounce from '../../../hooks/useDebounce'
import { toast } from 'react-toastify'
import { COMMET_MESSAGE } from '../../../constants/message'
import { userCommentApi } from '../../../apis/users/comment.api'

export default function Comments() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState<string>('')
  const debounceSearch = useDebounce(search, 500)
  const queryParams: CommentQueryParamsConfig = useQueryParams()
  const queryConfig: CommentQueryParamsConfig = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 30,
    search: queryParams.search || debounceSearch
  }

  // --- Get Comments --- //
  const getComments = useInfiniteQuery({
    queryKey: ['adminGetComments', queryConfig],
    queryFn: () => adminCommentApi.getCommentsAll(queryConfig),
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  // --- Delete Comment Mutation --- //
  const deleteCommentMutation = useMutation({
    mutationFn: (comment_id: number) => userCommentApi.deleteComment(comment_id),
    onSuccess: () => {
      toast.success(COMMET_MESSAGE.DELETE_COMMENT_SUCCESS)
      queryClient.invalidateQueries({ queryKey: ['adminGetComments'] })
      queryClient.invalidateQueries({ queryKey: ['getComments'] })
    }
  })

  const comments = getComments.data?.pages.flatMap((page) => page.data.data.comments) || []
  const { hasNextPage, fetchNextPage } = getComments

  return (
    <div className='h-full bg-white'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Quản Lý Bình Luận
      </div>
      {/* --- Filter Categories --- */}
      <div id='scrollableDiv' className='py-4 h-[calc(100vh-120px)] overflow-y-scroll'>
        <div className='mb-4 px-4'>
          <div className='flex items-center justify-between'>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              value={search}
              type='text'
              placeholder='Tìm kiếm bình luận...'
              className='flex-1 border border-[#B3B3B3] placeholder:text-[#1A1A1A] rounded-lg px-4 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
        {/* --- Table Categories --- */}
        <div className=''>
          <InfiniteScroll
            dataLength={comments.length}
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
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[20%]'>Tên người bình luận</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[20%] text-center'>Ảnh đại diện</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[30%]'>Nội dung</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[20%]'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment: CommentType, index) => (
                  <tr key={comment.id} className={index % 2 === 0 ? 'bg-[#F9F9F9]' : ''}>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{comment.id}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{comment.full_name}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center'>
                      <div className='flex justify-center items-center'>
                        <img
                          src={comment.avatar || AvatarDefault}
                          className='w-14 h-14 py-1 object-contain rounded-md shadow-sm border border-gray-200'
                        />
                      </div>
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{comment.content}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center align-middle text-white'>
                      <div className='flex items-center justify-center gap-3'>
                        <button onClick={() => deleteCommentMutation.mutate(comment.id)}>
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
