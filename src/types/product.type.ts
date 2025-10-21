export interface ProductType {
  id: number
  name: string
  image: string
  images: string[]
  description: string
  price_before_discount: number
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
      total: number
      limit: number
      total_page: number
    }
  }
}

export interface GetProductResponseSuccess {
  message: string
  data: {
    id: number
    name: string
    image: string
    images: string[]
    description: string
    price_before_discount: number
    price: number
    rating: string
    sold: number
    stock: number
    category: {
      id: number
      name: string
    }
    brand: {
      id: number
      name: string
    }
    createAt: string
    updateAt: string
  }
}
