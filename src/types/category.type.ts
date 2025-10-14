export interface CategoryType {
  id: number
  name: string
  image: string
}

export interface AdminGetCategoriesResponseSuccess {
  message: string
  data: {
    categories: CategoryType[]
    pagination: {
      page: number
      limit: number
      total_page: number
    }
  }
}
