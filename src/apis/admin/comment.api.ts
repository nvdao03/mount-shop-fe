import type { ProductQueryParamsConfig } from '../../configs/product.config'
import http from '../../utils/http'

export const adminCommentApi = {
  // --- Get Comments ---
  getCommentsAll: (params: ProductQueryParamsConfig) => {
    return http.get('/admin/comments', {
      params
    })
  }
}
