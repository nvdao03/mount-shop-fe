import http from '../../utils/http'

export const adminProductApi = {
  // --- Add Product ---
  addProduct: (body: {
    name: string
    description: string
    image: string
    images: string[]
    price_before_discount: number
    price: number
    rating: string
    sold: number
    stock: number
    category_id: number
    brand_id: number
  }) => http.post('/admin/products', body),
  // --- Delete Product ---
  deleteProduct: (product_id: number) => http.delete(`/admin/products/${product_id}`),
  updateProduct: (
    product_id: number,
    body: {
      name: string
      description: string
      image: string
      images: string[]
      price_before_discount: number
      price: number
      rating: string
      sold: number
      stock: number
      category_id: number
      brand_id: number
    }
  ) => http.put(`/admin/products/${product_id}`, body)
}
