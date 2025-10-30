import { Link, useParams } from 'react-router-dom'
import { PATH } from '../../../constants/path'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userOrderApi } from '../../../apis/users/order.api'
import { useMemo, useState } from 'react'
import type { OrderReponseSuccess } from '../../../types/order.type'
import { ORDER_STATUS } from '../../../constants/other'
import { formatCurrency } from '../../../utils/other'
import { toast } from 'react-toastify'
import { ORDER_MESSAGE } from '../../../constants/message'

export default function OderDetail() {
  const params = useParams()
  const queryClient = useQueryClient()
  const orderId = Number(params.order_id)
  const [isCancelOrderModal, setIsCancelOrderModal] = useState<boolean>(false)
  const [messageCancel, setMessageCancel] = useState<string>('')
  const [checkIdCancel, setCheckIdCancel] = useState<number | undefined>(undefined)

  // --- Get Order Detail ---
  const getOrderDetail = useQuery({
    queryKey: ['getOrderDetail', orderId],
    keepPreviousData: true,
    queryFn: () => userOrderApi.getOrderDetail(orderId as number),
    staleTime: 30 * 60 * 1000
  })

  // --- Update Order Cancel ---
  const updateOrderCancelMutation = useMutation({
    mutationFn: ({ order_id, body }: { order_id: number; body: { cancel_reason: string; status: string } }) =>
      userOrderApi.updateOrderCancel(order_id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['getOrderDetail', orderId])
      queryClient.invalidateQueries(['getOrders'])
      setIsCancelOrderModal(false)
      toast.success(ORDER_MESSAGE.CANCEL_ORDER_SUCCESS)
    }
  })

  // --- Handle Cancel Order ---
  const handleCancelOrder = (order_id: number, body: { cancel_reason: string; status: string }) => {
    updateOrderCancelMutation.mutate({ order_id, body })
  }

  // --- Handle Close Cancel Order Modal ---
  const handleCloseCancelOrderModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation()
    setIsCancelOrderModal(false)
    setCheckIdCancel(undefined)
    setMessageCancel('')
  }

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
                      Trạng thái: <span className='font-semibold'>ĐANG XỬ LÝ</span>
                    </span>
                  )}
                  {order?.status === ORDER_STATUS.DELIVERING && (
                    <span>
                      Trạng thái: <span className='font-semibold'>ĐANG GIAO HÀNG</span>
                    </span>
                  )}
                  {order?.status === ORDER_STATUS.DELIVERED && (
                    <span className='text-[#34C759]'>
                      Trạng thái: <span className='font-semibold'>GIAO HÀNG THÀNH CÔNG</span>
                    </span>
                  )}
                  {order?.status === ORDER_STATUS.CANCELLED && (
                    <span className='text-[#FF3B30]'>
                      Trạng thái: <span className='font-semibold'>HUỶ ĐƠN HÀNG</span>
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
                  onClick={() => setIsCancelOrderModal(true)}
                  type='submit'
                  className='w-full bg-[#FF3B30] mt-1 text-white py-3 md:py-4 rounded-lg font-medium transition'
                >
                  Huỷ đơn hàng
                </button>
              )}
              {order?.status === ORDER_STATUS.DELIVERING && (
                <button
                  type='submit'
                  disabled={true}
                  className='w-full cursor-not-allowed opacity-50 bg-primary mt-1 text-white py-3 md:py-4 rounded-lg font-medium transition'
                >
                  Huỷ đơn hàng
                </button>
              )}
              {order?.status === ORDER_STATUS.DELIVERED && (
                <button
                  type='submit'
                  disabled={true}
                  className='w-full cursor-not-allowed opacity-50 bg-primary mt-1 text-white py-3 md:py-4 rounded-lg font-medium transition'
                >
                  Đã giao hàng
                </button>
              )}
              {order?.status === ORDER_STATUS.CANCELLED && (
                <button
                  disabled={true}
                  type='submit'
                  className='w-full opacity-50 cursor-not-allowed bg-[#FF3B30] mt-1 text-white py-3 md:py-4 rounded-lg font-medium transition'
                >
                  Đã huỷ đơn hàng
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
      {/* Modal */}
      <div
        className={`cursor-pointer fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ease-in-out ${
          isCancelOrderModal ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => {
          setIsCancelOrderModal(false)
          setCheckIdCancel(undefined)
          setMessageCancel('')
        }}
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation()
          }}
          className='max-w-[330px] custom-sm:min-w-[450px] bg-white rounded-[10px]'
        >
          <div className='flex items-center py-3 px-4 sm:py-4 sm:px-6 border-b border-solid border-[#E6E6E6]'>
            <span className='text-center ml-[45px] flex-1 block font-semibold sm:text-[17px] text-[#333]'>
              Chọn lý do
            </span>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleCloseCancelOrderModal(e)}
              className='ml-auto bg-[#EAE9FC] block p-3.5 rounded-[50%]'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='17' height='15' viewBox='0 0 17 15' fill='none'>
                <path
                  d='M15.1042 0H1.5625C0.69987 0 0 0.69987 0 1.5625V13.0208C0 13.8835 0.69987 14.5833 1.5625 14.5833H15.1042C15.9668 14.5833 16.6667 13.8835 16.6667 13.0208V1.5625C16.6667 0.69987 15.9668 0 15.1042 0ZM12.3828 9.45638C12.5391 9.61263 12.5391 9.86654 12.3828 10.0228L11.0645 11.3411C10.9082 11.4974 10.6543 11.4974 10.498 11.3411L8.33333 9.1569L6.16862 11.3411C6.01237 11.4974 5.75846 11.4974 5.60221 11.3411L4.28385 10.0228C4.1276 9.86654 4.1276 9.61263 4.28385 9.45638L6.4681 7.29167L4.28385 5.12695C4.1276 4.9707 4.1276 4.7168 4.28385 4.56055L5.60221 3.24219C5.75846 3.08594 6.01237 3.08594 6.16862 3.24219L8.33333 5.42643L10.498 3.24219C10.6543 3.08594 10.9082 3.08594 11.0645 3.24219L12.3828 4.56055C12.5391 4.7168 12.5391 4.9707 12.3828 5.12695L10.1986 7.29167L12.3828 9.45638Z'
                  fill='#4F46E5'
                />
              </svg>
            </button>
          </div>
          <form
            onSubmit={() =>
              handleCancelOrder(orderId, { cancel_reason: messageCancel, status: ORDER_STATUS.CANCELLED })
            }
          >
            <div className='px-4 py-5 sm:py-6 sm:px-6 flex flex-col gap-4'>
              <span className='font-semibold md:text-[16px] leading-[1.5]'>
                Vui lòng chọn 1 trong số các lý do bạn muốn hủy đơn hàng:
              </span>
              <div className='flex flex-col'>
                {[
                  { id: 0, value: 'Sản phẩm giao hàng hơi lâu ' },
                  { id: 1, value: 'Sản phẩm không đúng với mô tả ' },
                  { id: 2, value: 'Tôi muốn đổi sản phẩm khác ' },
                  { id: 3, value: 'Tôi tìm thấy sản phẩm khác tương tự  ' },
                  { id: 4, value: 'Tôi muốn nhập thêm ưu đãi ' },
                  { id: 5, value: 'Thông tin cá nhân của tôi bị sai lệch ' },
                  { id: 6, value: 'Lý do khác' }
                ].map((item) => (
                  <div
                    onClick={() => setMessageCancel(item.value)}
                    key={item.id}
                    className='flex items-center gap-3 cursor-pointer'
                  >
                    <input
                      checked={checkIdCancel === item.id}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCheckIdCancel(e.target.checked ? item.id : undefined)
                      }
                      className='cursor-pointer'
                      type='checkbox'
                      id={`check-id-${item.id}`}
                    />
                    <label className='w-full py-3 cursor-pointer' htmlFor={`check-id-${item.id}`}>
                      {item.value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex gap-3 p-4 pt-0 sm:px-6 sm:pt-0'>
              <button
                disabled={checkIdCancel === undefined}
                className={`${checkIdCancel === undefined && 'opacity-50 cursor-not-allowed'} rounded-[8px] font-semibold py-3 sm:py-4 flex-1 flex bg-primary text-white items-center justify-center border border-solid border-primary`}
              >
                Xong
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
