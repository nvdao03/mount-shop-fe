import http from '../../utils/http'
import type { TypeSchemaAddCategory, TypeSchemaUpdateCategory } from '../../validation/category'

export const adminCategoryApi = {
  // --- Add Category ---
  addCategory: (body: TypeSchemaAddCategory) => http.post('/admin/categories', body),
  // --- Delete category ---
  deleteCategory: (category_id: number) => http.delete(`/admin/categories/${category_id}`),
  // --- Update Category ---
  updateCategory: (category_id: number, body: TypeSchemaUpdateCategory) =>
    http.put(`/admin/categories/${category_id}`, body),
  // --- Get All Category ---
  getCategoryDetail: (category_id: number) => http.get(`/admin/categories/${category_id}`)
}
