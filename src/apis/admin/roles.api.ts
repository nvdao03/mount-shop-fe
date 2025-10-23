import http from '../../utils/http'

export const adminRoleApi = {
  // --- Get Roles ---
  getRoles: async () => http.get('/admin/roles')
}
