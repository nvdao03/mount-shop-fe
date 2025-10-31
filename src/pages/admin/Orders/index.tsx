import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useDebounce from '../../../hooks/useDebounce'
import { ORDER_STATUS } from '../../../constants/other'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useQueryParams from '../../../hooks/useQueryParams'
import type { AdminGetOrdersQueryParamConfig } from '../../../configs/order.config'
import { adminOrderApi } from '../../../apis/admin/order.api'
import type { AdminGetOrderType } from '../../../types/order.type'
import AvatarDefault from '../../../assets/images/avatar-default.png'
import { formatCurrency } from '../../../utils/other'
import { toast } from 'react-toastify'
import { ORDER_MESSAGE } from '../../../constants/message'

export default function Orders() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState<string>('')
  const [statusOrdeFilter, setStatusOrderFilter] = useState<string>('')
  const searchDebounce = useDebounce(search, 500)

  const queryParams: AdminGetOrdersQueryParamConfig = useQueryParams()
  const queryConfig: AdminGetOrdersQueryParamConfig = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    search: queryParams.search || searchDebounce,
    status: queryParams.status || statusOrdeFilter
  }

  // --- Get Orders --- //
  const getOrders = useInfiniteQuery({
    queryKey: ['adminGetOrders', queryConfig],
    queryFn: ({ pageParam = queryConfig.page }) =>
      adminOrderApi.getOrdersAll({
        ...queryConfig,
        page: pageParam
      }),
    keepPreviousData: true,
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  // --- Update Order Mutation --- //
  const updateOrderMutation = useMutation({
    mutationFn: ({ order_id, body }: { order_id: number; body: { status: string } }) =>
      adminOrderApi.updateOrder(order_id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGetOrders', queryConfig] })
      queryClient.invalidateQueries(['getOrderDetail'])
      queryClient.invalidateQueries(['getOrders'])
      toast.success(ORDER_MESSAGE.UPDATE_ORDER_SUCCESS)
    }
  })

  // --- Handle Update Order --- //
  const handleUpdateOrder = (order_id: number, body: { status: string }) =>
    updateOrderMutation.mutate({ order_id, body })

  const { data, fetchNextPage, hasNextPage } = getOrders

  const orders = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data.orders as AdminGetOrderType[]) || []
  }, [data?.pages])

  return (
    <div className='h-full bg-white'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Quản Lý Đơn Hàng
      </div>
      {/* --- Filter Order --- */}
      <div id='scrollableDiv' className='py-4 h-[calc(100vh-120px)] overflow-y-scroll'>
        <div className='mb-4 px-4'>
          <div className='flex items-center justify-between'>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              value={search}
              type='text'
              placeholder='Tìm kiếm đơn hàng...'
              className='w-[80%] border border-[#B3B3B3] placeholder:text-[#1A1A1A] rounded-lg px-4 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            />
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (e.target.value === '') {
                  setStatusOrderFilter('')
                  getOrders.refetch()
                }
                setStatusOrderFilter(e.target.value)
              }}
              className='w-[18%] cursor-pointer border border-[#B3B3B3] placeholder:text-[#1A1A1A] rounded-lg px-2 py-[9px] outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Trạng thái</option>
              <option value={ORDER_STATUS.PROCESSING}>Đang xử lý</option>
              <option value={ORDER_STATUS.DELIVERING}>Đang giao hàng</option>
              <option value={ORDER_STATUS.DELIVERED}>Đã giao hàng</option>
              <option value={ORDER_STATUS.CANCELLED}>Đã huỷ</option>
            </select>
          </div>
        </div>
        {/* --- Table Orders --- */}
        <div className=''>
          <InfiniteScroll
            dataLength={orders.length}
            hasMore={!!hasNextPage}
            next={fetchNextPage}
            loader={<h4>Loading...</h4>}
            scrollableTarget='scrollableDiv'
            className='py-4 h-[calc(100vh-120px)] overflow-y-scroll scrollbar-hide'
          >
            <table className='w-full text-left  border-solid border-[#E6E6E6] rounded-[10px]'>
              <thead className='font-semibold'>
                <tr>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[15%]'>Mã đơn hàng</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[18%]'>Tên khách hàng</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[20%] text-center'>Hình ảnh</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[20%] text-center'>Tổng tiền</th>
                  <th className='p-4 border-b border-solid border-[#E6E6E6] w-[20%] text-center'>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: AdminGetOrderType, index) => (
                  <tr key={order.id} className={index % 2 === 0 ? 'bg-[#F9F9F9]' : ''}>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>{order.id}</td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle leading-[1.5]'>
                      {order.full_name}
                    </td>
                    <td className='px-4 py-2 flex justify-center border-b border-solid border-[#E6E6E6] text-center'>
                      <div className='w-[50px] h-[60px] flex justify-center items-center'>
                        <img
                          src={order.avatar || AvatarDefault}
                          className='w-full h-full text-center py-1 object-cover rounded-full shadow-sm border border-gray-200'
                        />
                      </div>
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] text-center align-middle'>
                      {formatCurrency(order.total_price)}đ
                    </td>
                    <td className='px-4 border-b border-solid border-[#E6E6E6] align-middle'>
                      {order.status === ORDER_STATUS.CANCELLED || order.status === ORDER_STATUS.DELIVERED ? (
                        <span className='text-center w-full block border border-[#B3B3B3] rounded-lg px-2 py-[9px] bg-transparent outline-none cursor-pointer'>
                          {order.status === ORDER_STATUS.CANCELLED ? 'Đã huỷ' : 'Đã giao hàng'}
                        </span>
                      ) : (
                        <select
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (e.target.value) {
                              handleUpdateOrder(order.id, { status: e.target.value })
                            }
                          }}
                          className='w-full border border-[#B3B3B3] rounded-lg px-2 py-[9px] bg-transparent outline-none cursor-pointer'
                        >
                          <option value=''>
                            {order.status === ORDER_STATUS.PROCESSING && 'Đang xử lý'}
                            {order.status === ORDER_STATUS.DELIVERING && 'Đang giao hàng'}
                            {order.status === ORDER_STATUS.CANCELLED && 'Đã huỷ'}
                          </option>
                          {[
                            { id: 0, name: 'Đang xử lý', value: ORDER_STATUS.PROCESSING },
                            { id: 1, name: 'Đang giao hàng', value: ORDER_STATUS.DELIVERING },
                            { id: 2, name: 'Đã giao hàng', value: ORDER_STATUS.DELIVERED }
                          ].map((item) => {
                            if (item.value === order.status) return
                            return (
                              <option key={item.id} value={item.value}>
                                {item.name}
                              </option>
                            )
                          })}
                        </select>
                      )}
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
