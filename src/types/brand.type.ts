export interface BrandType {
  id: number
  name: string
  image: string
}

export interface GetBrandsResponseSuccess {
  message: string
  data: {
    brands: BrandType[]
    pagination: {
      page: number
      limit: number
      total_page: number
    }
  }
}
