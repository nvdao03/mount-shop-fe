import http from '../../utils/http'

export const userOrderApi = {
  // --- Add Order ---
  addOrder: (data: { address_id: number; cart_ids: number[]; total_price: number }) => http.post('/user/orders', data)
}
