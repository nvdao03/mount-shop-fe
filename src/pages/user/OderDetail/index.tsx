import { Link, useParams } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import ArrowRight from '../../../assets/icons/arrow-right.svg'
import { useQuery } from '@tanstack/react-query'
import { userOrderApi } from '../../../apis/users/order.api'
import { useMemo } from 'react'
import type { OrderReponseSuccess } from '../../../types/order.type'
import { ORDER_STATUS } from '../../../constants/other'
import { formatCurrency } from '../../../utils/other'

export default function OderDetail() {
  const params = useParams()
  const orderId = Number(params.order_id)

  const getOrderDetail = useQuery({
    queryKey: ['getOrderDetail', orderId],
    queryFn: () => userOrderApi.getOrderDetail(orderId as number),
    staleTime: 30 * 60 * 1000
  })

  const order = useMemo(() => {
    if (!getOrderDetail.data?.data) return
    return getOrderDetail.data.data.data.order as OrderReponseSuccess
  }, [getOrderDetail.data?.data])

  return (
    <div>
      <div className='relative min-h-[calc(100vh-80px)] pt-[85px] sm:min-h-[540px]'>
        {/* Content */}
        <main className='w-full px-4 max-w-7xl mx-auto grid grid-cols-12 gap-4 pt-4 md:pt-7'>
          <section className='col-span-12 lg:col-span-8'>
            {/* Block 1 */}
            <div>
              <div className='flex gap-3 items-center mb-5 md:mb-0'>
                <Link to={PATH.USER_PROFILE} className='block md:hidden bg-[#EAE9FC] p-3 rounded-full'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 12 18' fill='none'>
                    <path
                      d='M0.985565 8.11485L8.06669 1.03373C8.55612 0.544299 9.34754 0.544299 9.83176 1.03373L11.0085 2.21044C11.4979 2.69988 11.4979 3.49129 11.0085 3.97552L5.99442 8.99999L11.0137 14.0193C11.5031 14.5087 11.5031 15.3001 11.0137 15.7843L9.83697 16.9662C9.34754 17.4557 8.55612 17.4557 8.07189 16.9662L0.990772 9.88513C0.496135 9.3957 0.496135 8.60428 0.985565 8.11485Z'
                      fill='#4F46E5'
                    />
                  </svg>
                </Link>
                <h2 className='custom_title_h2 md:mb-5'>Thông tin đơn hàng</h2>
              </div>
              <div className='bg-white rounded-[10px] px-3 py-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:gap-4'>
                <div className='w-full md:w-auto pb-4 border-b border-solid border-[#E6E6E6] sm:border-none sm:pb-0 flex flex-col gap-3'>
                  <span className='font-semibold'>{order?.full_name}</span>
                  <span>{order?.address}</span>
                  <span>{order?.phone}</span>
                </div>
                <div className='w-full md:w-auto pt-4 sm:pt-0 flex flex-col gap-3'>
                  <span className='font-semibold'>Mã đơn hàng: 0{order?.id}</span>
                  {order?.status === ORDER_STATUS.PROCESSING && (
                    <span>
                      Trạng thái xử lý: <span className='font-semibold'>Đang xử lý</span>
                    </span>
                  )}
                  {order?.cancel_reason && order.cancel_reason.trim() !== '' && (
                    <span>Lý do: {order.cancel_reason}</span>
                  )}
                </div>
              </div>
            </div>
            {/* Block 2 */}
            <div className='mt-8'>
              <h2 className='custom_title_h2 mb-5'>Sản phẩm trong đơn</h2>
              {/* Carts List */}
              <div className='bg-white rounded-[10px] overflow-hidden'>
                {order &&
                  order.items.map((item, index) => (
                    <Link
                      to={`/product-detail/${item.product_id}`}
                      key={index}
                      className={`${index === order.items.length - 1 && 'border-none'} bg-white py-4 border-b border-solid border-[#E6E6E6] md:py-4 px-2 md:px-4 flex flex-col md:gap-8 md:flex md:flex-row md:items-center md:justify-between`}
                    >
                      <div className='flex items-start gap-4'>
                        <div className='flex gap-3 md:gap-4'>
                          <div className='flex-shrink-0 w-[80px] h-[80px]'>
                            <img
                              className='flex-shrink-0 rounded-[5px] object-cover'
                              src={item.image}
                              alt={item.name}
                            />
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
              </div>
            </div>
          </section>
          <section className='col-span-12 lg:col-span-4'>
            <div className='bg-white py-4 px-3 md:px-4 rounded-[10px]'>
              <h3 className='font-semibold md:text-[17px]'>Thông tin đơn hàng</h3>
              <ul className='my-4'>
                <li className='flex items-center justify-between py-3 border-b border-solid border-[#E6E6E6]'>
                  <span>Tạm tính</span>
                  <span className='font-medium'>{formatCurrency(order?.total_price as number)}đ</span>
                </li>
                <li className='flex items-center justify-between py-3 border-b border-solid border-[#E6E6E6]'>
                  <span>Khuyến mãi </span>
                  <span className='font-medium'>0đ</span>
                </li>
                <li className='flex items-center justify-between py-3 border-b border-solid border-[#E6E6E6]'>
                  <span>Thành tiền</span>
                  <span className='block text-primary font-semibold md:text-[18px]'>
                    {formatCurrency(order?.total_price as number)}đ
                  </span>
                </li>
              </ul>
              {order?.status === ORDER_STATUS.PROCESSING && (
                <button
                  type='submit'
                  className='w-full bg-[#FF3B30] mt-1 text-white py-3 md:py-4 rounded-lg font-medium transition'
                >
                  Huỷ đơn hàng
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
      {/* Modal */}
    </div>
  )
}
