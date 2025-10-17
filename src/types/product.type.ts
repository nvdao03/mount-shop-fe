export interface ProductType {
  id: number
  name: string
  image: string
  images: string[]
  description: string
  discount_price: number
  price: number
  rating: string
  sold: number
  stock: number
  category_id: number
  brand_id: number
  createdAt: string
  updatedAt: string
}

export interface GetProductsResponseSuccess {
  message: string
  data: {
    products: ProductType[]
    pagination: {
      page: number
      limit: number
      total_page: number
    }
  }
}
