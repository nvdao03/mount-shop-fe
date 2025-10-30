import type { AdminGetOrdersQueryParamConfig } from '../../configs/order.config'
import http from '../../utils/http'

export const adminOrderApi = {
  getOrdersAll: (params: AdminGetOrdersQueryParamConfig) =>
    http.get('/admin/orders', {
      params
    }),
  updateOrder: (order_id: number, data: { status: string }) => http.put(`/admin/orders/${order_id}`, data)
}
