import http from '../../utils/http'

export const userCommentApi = {
  // --- Add Comment ---
  addComment: (data: { product_id: number; content: string }) => {
    return http.post('user/comments', data)
  }
}
