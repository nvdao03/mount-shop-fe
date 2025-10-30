export interface DashboardType {
  orders: {
    id: number
    full_name: string
    avatar: string
    status: string
    total_price: number
    createdAt: string
    updatedAt: string
  }[]
  totalOrder: number
  totalProduct: number
  totalRevenue: string
  totalUser: number
}
