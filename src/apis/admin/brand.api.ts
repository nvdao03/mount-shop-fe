import type { BrandQueryParamConfig } from '../../configs/brand.config'
import type { GetBrandsResponseSuccess } from '../../types/brand.type'
import http from '../../utils/http'
import type { TypeSchemaAddBrand } from '../../validation/brand'

export const adminBrandApi = {
  // --- Get Brand --- /
  getBrands: (params: BrandQueryParamConfig) =>
    http.get<GetBrandsResponseSuccess>('/admin/brands', {
      params
    }),
  // --- Add Brand --- /
  addBrand: (data: TypeSchemaAddBrand) => http.post('/admin/brands', data),
  // --- Delete Brand --- /
  deleteBrand: (brand_id: number) => http.delete(`/admin/brands/${brand_id}`)
}
