import http from '../../utils/http'

export const userCommentApi = {
  // --- Add Comment ---
  addComment: (data: { product_id: number; content: string }) => {
    return http.post('user/comments', data)
  },
  // --- Delete comment --- //
  deleteComment: (comment_id: number) => http.delete(`/user/comments/${comment_id}`)
}
