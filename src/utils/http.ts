import type { AxiosInstance } from 'axios'
import axios from 'axios'

const URL = import.meta.env.VITE_API_ROOT

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      function (config) {
        // Làm gì đó trước khi request dược gửi đi
        return config
      },
      function (error) {
        // Làm gì đó với lỗi request
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      function (response) {
        // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
        // Làm gì đó với dữ liệu response
        return response
      },
      function (error) {
        // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
        // Làm gì đó với lỗi response
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
