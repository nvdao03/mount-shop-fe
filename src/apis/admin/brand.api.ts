import type { BrandQueryParamConfig } from '../../configs/brand.config'
import type { GetBrandsResponseSuccess } from '../../types/brand.type'
import http from '../../utils/http'

export const adminBrandApi = {
  // --- Get Brand --- /
  getBrands: (params: BrandQueryParamConfig) =>
    http.get<GetBrandsResponseSuccess>('/admin/brands', {
      params
    })
}
