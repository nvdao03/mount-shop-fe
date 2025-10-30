import { Link, useNavigate } from 'react-router-dom'
import { PATH } from '../../../../../constants/path'
import { useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { userOrderApi } from '../../../../../apis/users/order.api'
import useQueryParams from '../../../../../hooks/useQueryParams'
import type { OrderQueryParamConfig } from '../../../../../configs/order.config'
import type { OrderReponseSuccess } from '../../../../../types/order.type'
import { formatCurrency } from '../../../../../utils/other'
import { ORDER_STATUS } from '../../../../../constants/other'

interface PropTypes {
  setMenu: React.Dispatch<
    React.SetStateAction<'sider_bar' | 'user_info' | 'order_item' | 'update_profile' | 'change_password'>
  >
}

export default function ProfileOrder({ setMenu }: PropTypes) {
  const [orderStatus, setOrderStatus] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const queryParams: OrderQueryParamConfig = useQueryParams()
  const queryConfig: OrderQueryParamConfig = {
    limit: queryParams.limit || 15,
    page: queryParams.page || 1,
    status: queryParams.status || orderStatus
  }

  // --- Get Orders --- //
  const getOrders = useInfiniteQuery({
    queryKey: ['getOrders', queryConfig],
    queryFn: ({ pageParam }) =>
      userOrderApi.getOrders({
        ...queryConfig,
        page: pageParam
      }),
    keepPreviousData: true,
    getNextPageParam: (lastpage) => {
      const { pagination } = lastpage.data.data
      return pagination.page < pagination.total_page ? pagination.page + 1 : undefined
    }
  })

  const orders = useMemo(() => {
    if (!getOrders.data?.pages) return []
    return getOrders.data?.pages.flatMap((page) => page.data.data.orders) || []
  }, [getOrders.data?.pages])

  return (
    <div className='flex flex-col h-full'>
      {/* Title */}
      <div className='px-4 py-6 flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6]'>
        <button
          onClick={() => {
            setMenu('sider_bar')
            navigate(PATH.USER_PROFILE)
          }}
          className='block md:hidden bg-[#EAE9FC] p-2.5 rounded-full'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 12 18' fill='none'>
            <path
              d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
              fill='#4F46E5'
            />
          </svg>
        </button>
        <h2 className='custom_title_h2'>Đơn hàng của tôi</h2>
      </div>
      {/* List options */}
      <div
        className='overflow-x-auto overscroll-x-none scroll-smooth scrollbar-hide border-b border-solid border-[#E6E6E6]'
        style={{ scrollbarWidth: 'none' }}
      >
        <div className='flex min-w-max px-4 py-2 whitespace-nowrap snap-x snap-mandatory'>
          {[
            { id: 0, name: 'Tất cả', value: undefined },
            { id: 1, name: 'Đang xử lý', value: 'processing' },
            { id: 2, name: 'Đang giao hàng', value: 'delivering' },
            { id: 3, name: 'Đã nhận hàng', value: 'delivered' },
            { id: 4, name: 'Đã huỷ đơn hàng', value: 'cancelled' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setOrderStatus(item.value)}
              className={`${orderStatus === item.value ? '!text-primary' : 'text-[#B3B3B3]'} text-[15px] snap-start font-medium px-3 py-2 md:px-4 md:py-4`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      {/* List orders */}
      <div className='pb-6 pt-3 flex flex-col gap-4'>
        {!orders ||
          (orders.length === 0 && (
            <div className='flex justify-center items-center mt-[180px]'>
              <span className='text-[#B3B3B3] text-[15px] font-medium'>Không có đơn hàng nào</span>
            </div>
          ))}
        {orders.map((order: OrderReponseSuccess) => {
          return (
            <div
              key={order.id}
              className='relative after:absolute after:w-full after:left-0 after:right-0 after:h-[0.5px] after:bg-[#E6E6E6] after:bottom-0 px-4 lg:px-4 py-2'
            >
              <div className='px-0 md:px-4 mb-2 flex justify-between items-center'>
                <h3 className='font-semibold text-[16px] leading-[1.5] md:text-[17px]'>
                  {order.status === ORDER_STATUS.PROCESSING
                    ? 'Đang xử lý'
                    : order.status === ORDER_STATUS.DELIVERING
                      ? 'Đang giao hàng'
                      : order.status === ORDER_STATUS.DELIVERED
                        ? 'Đã nhận hàng'
                        : 'Đã huỷ'}
                </h3>
                <Link
                  to={`/order-detail/${order.id}`}
                  className='text-[14px] text-primary font-semibold flex items-center gap-2'
                >
                  Xem chi tiết
                  <svg xmlns='http://www.w3.org/2000/svg' width='11' height='17' viewBox='0 0 11 17' fill='none'>
                    <path
                      d='M10.39 9.21847L3.30886 16.2996C2.81943 16.789 2.02801 16.789 1.54379 16.2996L0.367073 15.1229C-0.122358 14.6334 -0.122358 13.842 0.367073 13.3578L5.38634 8.33854L0.367073 3.31928C-0.122358 2.82984 -0.122358 2.03843 0.367073 1.5542L1.53858 0.367073C2.02801 -0.122358 2.81943 -0.122358 3.30365 0.367073L10.3848 7.44819C10.8794 7.93762 10.8794 8.72904 10.39 9.21847Z'
                      fill='#4F46E5'
                    />
                  </svg>
                </Link>
              </div>
              {order.items.map((item, index) => (
                <Link
                  to={`/product-detail/${item.product_id}`}
                  key={index}
                  className='bg-white py-4 md:py-4 px-2 md:px-4 rounded-[10px] flex flex-col md:gap-8 md:flex md:flex-row md:items-center md:justify-between'
                >
                  <div className='flex items-start gap-4'>
                    <div className='flex gap-3 md:gap-4'>
                      <div className='flex-shrink-0 w-[80px] h-[80px]'>
                        <img className='flex-shrink-0 rounded-[5px] object-cover' src={item.image} alt={item.name} />
                      </div>
                      <div className='flex flex-col gap-3 md:flex md:flex-col md:justify-around md:gap-2'>
                        <h3 className='font-semibold text-[16px] leading-[1.5] md:text-[16px]'>{item.name}</h3>
                        <div className='text-[14px]'>
                          <span className='block leading-[1.5]'>Thương hiệu: {item.brand}</span>
                        </div>
                        <div className='flex items-center flex-wrap gap-2 leading-[1.5]'>
                          <span className='text-[16px] sm:text-[17px] font-semibold text-primary'>
                            {formatCurrency(item.price)}đ
                          </span>
                          <span className='p-1 font-medium text-[12px]'>x {item.quantity} sản phẩm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className='px-0 md:px-4 my-4 flex items-center justify-between'>
                <span className='text-[14px]'>Tổng cộng:</span>
                <span className='font-semibold text-[16px] md:text-[17px]'>{formatCurrency(order.total_price)}đ</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
