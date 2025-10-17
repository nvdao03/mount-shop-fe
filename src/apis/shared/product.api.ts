import type { ProductQueryParamsConfig } from '../../configs/product.config'
import http from '../../utils/http'

export const productApi = {
  // --- Get Products ---
  getProducts: (params: ProductQueryParamsConfig) => {
    return http.get('/products', {
      params
    })
  }
}
