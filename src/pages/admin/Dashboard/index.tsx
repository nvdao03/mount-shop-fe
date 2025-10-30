import { useQuery } from '@tanstack/react-query'
import { adminDashboardApi } from '../../../apis/admin/dashboard.api'
import { useMemo } from 'react'
import type { DashboardType } from '../../../types/dashboard.type'
import { formatCurrency } from '../../../utils/other'
import AvatarDefault from '../../../assets/images/avatar-default.png'
import { ORDER_STATUS } from '../../../constants/other'
import { useNavigate } from 'react-router-dom'
import { HTTP_STATUS } from '../../../constants/httpStatus'
import { PATH } from '../../../constants/path'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const navigate = useNavigate()

  // --- Get Dashboard --- //
  const getDashboard = useQuery({
    queryKey: ['getDashboard'],
    queryFn: () => adminDashboardApi.getDashboard(),
    keepPreviousData: true,
    onError: (errors: any) => {
      const message = errors.response.data.message
      if (errors.response.status === HTTP_STATUS.UNAUTHORIZED) {
        navigate(PATH.HOME)
        toast.error(message)
        return
      }
    }
  })

  const dashboards = useMemo<DashboardType>(() => {
    return (
      getDashboard.data?.data?.data?.dashboard || {
        totalProduct: 0,
        totalUser: 0,
        totalOrder: 0,
        totalRevenue: 0
      }
    )
  }, [getDashboard.data?.data])

  return (
    <div className='h-full bg-white'>
      {/* --- Title --- */}
      <div className='px-4 text-[16px] py-6 justify-center flex items-center gap-3 border-b-[0.5px] border-solid border-[#E6E6E6] font-semibold'>
        Tổng Quan Hệ Thống
      </div>
      {/* --- Summary */}
      <div className='px-4 py-6 grid grid-cols-4 gap-3'>
        <div className='flex flex-col items-start gap-3 bg-white rounded-lg shadow-lg p-4'>
          <span className='font-medium'>Tổng sản phẩm</span>
          <span className='font-semibold text-primary text-[18px]'>{dashboards.totalProduct}</span>
        </div>
        <div className='flex flex-col items-start gap-3 bg-white rounded-lg shadow-lg p-4'>
          <span className='font-medium'>Tổng người dùng</span>
          <span className='font-semibold text-primary text-[18px]'>{dashboards.totalUser}</span>
        </div>
        <div className='flex flex-col items-start gap-3 bg-white rounded-lg shadow-lg p-4'>
          <span className='font-medium'>Tổng đơn hàng</span>
          <span className='font-semibold text-primary text-[18px]'>{dashboards.totalOrder}</span>
        </div>
        <div className='flex flex-col items-start gap-3 bg-white rounded-lg shadow-lg p-4'>
          <span className='font-medium'>Tổng doanh thu</span>
          <span className='font-semibold text-primary text-[18px]'>
            {formatCurrency(Number(dashboards.totalRevenue))}đ
          </span>
        </div>
      </div>
      {/* --- List orders --- */}
      <div
        style={{ scrollbarWidth: 'none' }}
        className='pt-2 pb-4 h-[calc(100vh-250px)] overflow-y-scroll scrollbar-hide'
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
            {dashboards.orders &&
              dashboards.orders.map((order: any, index) => (
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
                    <span className='text-center w-full block border border-[#B3B3B3] rounded-lg px-2 py-[9px] bg-transparent outline-none cursor-pointer'>
                      {order.status === ORDER_STATUS.CANCELLED && 'Đã huỷ'}
                      {order.status === ORDER_STATUS.DELIVERING && 'Đang giao hàng'}
                      {order.status === ORDER_STATUS.DELIVERED && 'Đã giao hàng'}
                      {order.status === ORDER_STATUS.PROCESSING && 'Đang xử lý'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
