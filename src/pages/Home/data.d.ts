export interface OperationItem {
  key: 'LIKE' | 'DISLIKE' | 'COLLECT' | 'COMMENT'
  icon: any
  text: number
  hint: string
}

export type BlogSortKey = 'createdDate' | 'reads' | 'likes' | 'collections' | 'comments'
