import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useQueryParams from '../../../hooks/useQueryParams'
import type { UserQueryParamsConfig } from '../../../configs/user.config'
import { adminUserApi } from '../../../apis/admin/user.api'
import type { AdminGetUserType } from '../../../types/user.type'
import AvatarDefault from '../../../assets/images/avatar-default.png'
import { ROLES } from '../../../constants/other'
import { adminRoleApi } from '../../../apis/admin/roles.api'
import type { RoleType } from '../../../types/role.type'
import { toast } from 'react-toastify'
import { USER_MESSAGE } from '../../../constants/message'
import { useState } from 'react'
import useDebounce from '../../../hooks/useDebounce'

export default function Users() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState<string>('')
  const searchDbounce = useDebounce(search, 500)
  const queryParams: UserQueryParamsConfig = useQueryParams()
  const queryConfig: UserQueryParamsConfig = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 15,
    search: queryParams.search || searchDbounce
  }

  // --- Get Users --- //
  const getUsers = useInfiniteQuery({
    queryKey: ['adminGetUsers', queryConfig],
    queryFn: ({ pageParam = queryConfig.page }) => adminUserApi.getUsers({ ...queryConfig, page: pageParam }),
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  // --- Get Role --- //
  const getRoles = useQuery({
    queryKey: ['adminGetRoles'],
    queryFn: () => adminRoleApi.getRoles()
  })

  // --- Update User Role --- //
  const updateUserRoleMutation = useMutation({
    mutationFn: (data: { user_id: number; role_id: number }) => adminUserApi.updateUserRole(data),
    onSuccess: () => {
      toast.success(USER_MESSAGE.UPDATE_USER_ROLE_SUCCESS, {
        style: {
          lineHeight: '1.5',
          fontSize: '16px'
        }
      })
      queryClient.invalidateQueries({ queryKey: ['adminGetUsers', queryConfig] })
    }
  })

  // --- Delete User --- //
  const deleteUserMutation = useMutation({
    mutationFn: (user_id: number) => adminUserApi.deleteUser(user_id),
    onSuccess: () => {
      toast.success(USER_MESSAGE.DELETE_USER_SUCCESS)
      queryClient.invalidateQueries({ queryKey: ['adminGetUsers', queryConfig] })
    }
  })

  const { fetchNextPage, hasNextPage } = getUsers
  const roles = (getRoles?.data?.data && (getRoles.data.data.data.roles as RoleType[])) || []
  const users = getUsers.data?.pages.flatMap((page) => page.data.data.users) || []

  return (
    <div className='h-full bg-white'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Quản Lý Người Dùng
      </div>
      {/* --- Filter Users --- */}
      <div id='scrollableDiv' className='py-4 h-[calc(100vh-120px)] overflow-y-scroll'>
        <div className='mb-4 px-4'>
          <div className='flex items-center justify-between'>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              value={search}
              type='text'
              placeholder='Tìm kiếm người dùng...'
              className='w-[80%] border border-[#B3B3B3] placeholder:text-[#1A1A1A] rounded-lg px-4 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Link to={PATH.ADMIN_ADD_USER} className='bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-700'>
              + Thêm người dùng
            </Link>
          </div>
        </div>
        {/* --- Table Users --- */}
        <div className=''>
          <InfiniteScroll
            dataLength={users.length}
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
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[10%]'>Email</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[25%]'>Tên người dùng</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[20%] text-center'>Hình ảnh</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[20%] text-center'>Vai trò</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] text-center w-[15%]'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: AdminGetUserType, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-[#F9F9F9]' : ''}>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{user.id}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle leading-[1.5]'>
                      {user.email}
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle leading-[1.5]'>
                      {user.full_name}
                    </td>
                    <td className='px-4 py-2 flex justify-center border-b border-solid border-[#E6E6E6] text-center'>
                      <div className='w-[50px] h-[60px] flex justify-center items-center'>
                        <img
                          src={user.avatar || AvatarDefault}
                          className='w-full h-full text-center py-1 object-cover rounded-full shadow-sm border border-gray-200'
                        />
                      </div>
                    </td>
                    <td className='border-b border-solid border-[#E6E6E6] align-middle'>
                      <select
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          if (e.target.value) {
                            updateUserRoleMutation.mutate({
                              user_id: user.id,
                              role_id: Number(e.target.value)
                            })
                          }
                        }}
                        className='px-2 w-full border border-[#B3B3B3] rounded-lg py-[9px] bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-blue-500'
                        value={user.role_id}
                      >
                        <option value='' disabled>
                          {user.role === ROLES.CUSTOMER ? 'Khách hàng' : user.role}
                        </option>
                        {roles.map((role: RoleType) => (
                          <option key={role.id} className={`${role.id === user.role_id && 'hidden'}`} value={role.id}>
                            {role.name === ROLES.CUSTOMER
                              ? 'Khách hàng'
                              : role.name === ROLES.ADMIN
                                ? 'Quản trị viên'
                                : role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center align-middle text-white'>
                      <div className='flex items-center justify-center gap-3'>
                        <button onClick={() => deleteUserMutation.mutate(user.id)}>
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
