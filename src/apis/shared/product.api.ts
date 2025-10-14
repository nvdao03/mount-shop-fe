import http from '../../utils/http'

export const productApi = {
  getProducts: (params: { limit: string; page: string }) => {
    return http.get('/products', {
      params
    })
  }
}
