export interface Post {
  id: number
  title: string
  content: string
  author: string
  created_at: string
  published_at: string
  updated_at: string
  tags: string[]
  is_deleted: boolean
}

export interface RareResource {
  id: number
  title: string
  content: string
  credit: number
}
