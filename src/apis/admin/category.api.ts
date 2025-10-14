import http from '../../utils/http'
import type { TypeSchemaAddCategory } from '../../validation/category'

export const adminCategoryApi = {
  // --- Add Category ---
  addCategory: (body: TypeSchemaAddCategory) => http.post('/admin/categories', body),
  // --- Delete category ---
  deleteCategory: (category_id: number) => http.delete(`/admin/categories/${category_id}`)
}
