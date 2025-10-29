export interface OrderReponseSuccess {
  id: number
  status: string
  total_price: number
  createdAt: string
  updatedAt: string
  items: {
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
