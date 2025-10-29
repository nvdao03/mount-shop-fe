import http from '../../utils/http'
import type { TypeSchemaAddAddress } from '../../validation/address'

export const userAddressApi = {
  getAddresses: () => http.get('/user/addresses'),
  addAddress: (data: TypeSchemaAddAddress) => http.post('/user/addresses', data)
}
