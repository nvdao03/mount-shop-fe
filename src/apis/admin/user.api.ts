import type { UserQueryParamsConfig } from '../../configs/user.config'
import http from '../../utils/http'
import type { TypeAdminAddUser } from '../../validation/user'

export const adminUserApi = {
  // --- Get Users ---
  getUsers: (params: UserQueryParamsConfig) =>
    http.get('/admin/users', {
      params
    }),
  // --- Delete User ---
  deleteUser: (user_id: number) => http.delete(`/admin/users/${user_id}`),
  // --- Update User Role ---
  updateUserRole: (data: { user_id: number; role_id: number }) => http.put(`/admin/users`, data),
  // --- Add User ---
  addUser: (data: TypeAdminAddUser) => http.post('/admin/users', data)
}
