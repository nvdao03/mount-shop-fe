import type { ProductQueryParamsConfig } from '../../configs/product.config'
import http from '../../utils/http'

export const commentApi = {
  // --- Get Comments ---
  getComments: (product_id: number, params: ProductQueryParamsConfig) => {
    return http.get(`/comments/${product_id}`, {
      params
    })
  }
}
