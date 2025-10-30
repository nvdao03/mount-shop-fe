export interface OrderReponseSuccess {
  id: number
  status: string
  cancel_reason?: string | null
  total_price: number
  address?: string
  full_name?: string
  phone?: string
  createdAt: string
  updatedAt: string
  items: {
    product_id: number
    image: string
    brand: string
    name: string
    price: number
    quantity: number
  }[]
}

export interface GetOrdersResponseSuccess {
  message: string
  data: {
    orders: OrderReponseSuccess[]
    pagination: {
      page: number
      limit: number
      total_page: number
    }
  }
}
