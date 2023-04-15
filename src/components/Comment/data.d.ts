export type LikeType = 'LIKE' | 'DISLIKE'

export interface CommentProps {
  targetId: string
  targetType?: CommentType['targetType']
}

export interface CommentBarProps {
  targetId: string
  paramsRedirect: () => void
  commentInfo?: CommentType
  userInfo?: API.UserInfo
  targetType?: CommentType['targetType']
  setCommentList: (commentInfo: any) => void
}

export type LikeObjType = Record<
  string,
  {
    likes: number
    liked: boolean
    dislikes: number
    disliked: boolean
  }
>

interface CommentItemProps {
  commentInfo: CommentType
  isMe?: boolean
  children?: ReactNode
}

export interface CommentChildrenProps {
  commentInfo: CommentType
  targetId: string
  targetType?: CommentType['targetType']
}

export type SortKey = 'likeArr' | 'createdDate'

export interface CommentChildrenType {
  id: string
  parentId: string
  replyId: string
  replyName: string
  userId: string
  username: string
  userAvatar: string
  comment: string
  targetId: string
  level: 1 | 2 | 3
  targetType: 'Blog'
  status: 'READ' | 'UNREAD'
  createdDate: string
  likeArr: string[]
  dislikeArr: string[]
}

export interface CommentType {
  id: string
  parentId?: string
  userId: string
  username: string
  userAvatar: string
  comment: string
  targetId: string
  replyId?: string
  replyName?: string
  level: 1 | 2 | 3
  targetType: 'Blog'
  status: 'READ' | 'UNREAD'
  createdDate: string
  likeArr: string[]
  dislikeArr: string[]
  children: CommentChildrenType[]
  childrenTotal: number
}

export interface CommentAddParams {
  parentId?: string
  replyId?: string
  replyName?: string
  comment: string
  targetId: string
  level?: 1 | 2 | 3
  targetType?: 'Blog'
}

export interface CommentLikeParams {
  type: LikeType
  id: string
  userId: string
  isChildren?: boolean
}

export interface CommentDeleteParams {
  id: string
  targetId: string
  isChildren?: boolean
}
