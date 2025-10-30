import type { OrderQueryParamConfig } from '../../configs/order.config'
import http from '../../utils/http'

export const userOrderApi = {
  // --- Add Order ---
  addOrder: (data: { address_id: number; cart_ids: number[]; total_price: number }) => http.post('/user/orders', data),
  // --- Get Orders ---
  getOrders: (params: OrderQueryParamConfig) =>
    http.get('/user/orders', {
      params
    }),
  // --- Get Order Detail ---
  getOrderDetail: (order_id: number) => http.get(`/user/orders/${order_id}`)
}
