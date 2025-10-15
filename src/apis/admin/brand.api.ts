import type { BrandQueryParamConfig } from '../../configs/brand.config'
import type { GetBrandsResponseSuccess } from '../../types/brand.type'
import http from '../../utils/http'
import type { TypeSchemaAddBrand, TypeSchemaUpdateBrand } from '../../validation/brand'

export const adminBrandApi = {
  // --- Get Brands --- /
  getBrands: (params: BrandQueryParamConfig) =>
    http.get<GetBrandsResponseSuccess>('/admin/brands', {
      params
    }),
  // --- Get Brand ---
  getBrand: (brand_id: number) => http.get(`/admin/brands/${brand_id}`),
  // --- Add Brand --- /
  addBrand: (data: TypeSchemaAddBrand) => http.post('/admin/brands', data),
  // --- Delete Brand --- /
  deleteBrand: (brand_id: number) => http.delete(`/admin/brands/${brand_id}`),
  // --- Update Brand --- /
  updateBrand: (brand_id: number, body: TypeSchemaUpdateBrand) => http.put(`/admin/brands/${brand_id}`, body)
}
