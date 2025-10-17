export interface ProductQueryParamsConfig {
  limit?: string | number
  page?: string | number
  category?: string | number // Truyền category_id
  brands?: string[] | number[] // Truyền mảng brand_id
  search?: string
  min_price?: string | number
  max_price?: string | number
  rating?: string | number
  order?: 'asc' | 'desc'
}
