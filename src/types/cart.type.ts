export interface CartType {
  id: number
  quantity: number
  name: string
  image: string
  brand: string
  price: number
  price_before_discount: number
  createdAt: string
  updatedAt: string
}

export interface GetCartsResponseSuccess {
  message: string
  data: {
    carts: CartType[]
    total: number
  }
}
