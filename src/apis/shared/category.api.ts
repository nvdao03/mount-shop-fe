import http from '../../utils/http'

export const categoryApi = {
  // --- Get All Categories ---
  getAllCategories: () => {
    return http.get('/categories')
  },
  // --- Get All Brand By Category ---
  getBrandsByCategoryId: (category_id: number) => {
    return http.get(`/categories/${category_id}/brands`)
  }
}
