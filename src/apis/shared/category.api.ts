import type { CategoryQueryParamsConfig } from '../../configs/category.config'
import http from '../../utils/http'

export const categoryApi = {
  // --- Get Categories ---
  getCategories: (params?: CategoryQueryParamsConfig) => {
    return http.get('/categories', {
      params: params
    })
  },
  // --- Get All Brand By Category ---
  getBrandsByCategoryId: (category_id: number) => {
    return http.get(`/categories/${category_id}/brands`)
  }
}
