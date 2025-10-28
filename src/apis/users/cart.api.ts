import type { GetCartsResponseSuccess } from '../../types/cart.type'
import http from '../../utils/http'
import type { TypeSchemaAddCart } from '../../validation/cart'

export const userCartApi = {
  getCarts: () => http.get<GetCartsResponseSuccess>('/user/carts'),
  addCart: (data: TypeSchemaAddCart) => http.post('/user/carts', data),
  deleteCart: (cart_id: number) => http.delete(`/user/carts/${cart_id}`),
  updateCart: (cart_id: number, quantity: number) => http.put(`/user/carts/${cart_id}`, { quantity })
}
