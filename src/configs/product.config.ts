export interface ProductQueryParamsConfig {
  limit: string
  page: string
  category?: string // Truyền category_id
  brands?: string[] // Truyền mảng brand_id
  search?: string
  min_price?: string
  max_price?: string
  rating?: string
  order?: 'asc' | 'desc'
}
