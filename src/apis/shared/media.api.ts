import http from '../../utils/http'

export const mediaApi = {
  // --- Upload image ---
  uploadImage: (file: FormData) => http.post('/media/upload-image', file)
}
