export interface CommentType {
  content: string
  createdAt: string
  full_name: string
  avatar: string
  id: number
  updatedAt: string
  user_id: number
}

export interface GetCommentsResponseSuccess {
  message: string
  data: {
    comments: CommentType[]
    pagination: {
      page: number
      limit: number
      total_page: number
    }
  }
}
