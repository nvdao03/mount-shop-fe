import http from '../../utils/http'

export const adminDashboardApi = {
  getDashboard: () => http.get('/admin/dashboard')
}
