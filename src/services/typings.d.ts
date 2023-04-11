// @ts-ignore
/* eslint-disable */

declare namespace API {
  type PageParams = {
    dto?: Record<string, string | number>
    searchMap?: {
      [key: string]: {
        opt: 'LIKE' | 'IN' | 'NOT_IN'
        value: string
      }
    }
    betweenMap?: Record<string, string[]>
    isOr?: boolean // 是否并列
    /** 1是升序，-1是降序 */
    sort?: Record<string, 1 | -1>
    /** 过滤字段，为空不过滤，1显示，0不显示 */
    filter?: Record<string, 1 | 0>
    current?: number
    pageSize?: number
  }

  type TableListPagination = {
    total: number
    pageSize: number
    current: number
  }

  type UserInfo = {
    username?: string
    nickname?: string
    avatar?: string
    userId?: string
    createdDate?: string
    updateDate?: string
    signature?: string
    post?: string
    tags?: string[]
    notifyCount?: number
    unreadCount?: number
    blogs?: number
    comments?: number
    collections?: number
    watchers?: number
    followers?: number
    email?: string
    phone?: string
    country?: { label?: string; value?: string }
    area?: string[]
    address?: string
    access?: DataDictionary.ACCESS
  }

  type BlogDataItem = {
    id: string
    targetId: string
    userId: string[]
    likeArr: string[]
    readArr: string[]
    dislikeArr: string[]
    collectionArr: string[]
  }

  type BlogInfo = {
    id: string
    createdName: string
    createdUser: string
    createdSignature: string
    createdId: string
    createdAvatar: string
    createdDate: string
    approvedDate: string
    editor: DataDictionary.EDITOR
    status: DataDictionary.BLOG_STATUS
    title: string
    content: string
    mdData: string
    cover: string
    tags: string[]
    reads: number
    likes: number
    dislikes: number
    comments: number
    collections: number
    rejectReason?: string
    blogDataArr: BlogDataItem[]
  }

  type UpdateCurrentUser = Omit<
    UserInfo,
    'username' | 'userId' | 'createdDate' | 'access' | 'notifyCount' | 'unreadCount'
  >

  type LoginResult = {
    status?: string
    type?: string
    currentAuthority?: string
  }

  type RuleListItem = {
    key?: number
    disabled?: boolean
    href?: string
    avatar?: string
    name?: string
    owner?: string
    desc?: string
    callNo?: number
    status?: number
    updatedAt?: string
    createdAt?: string
    progress?: number
  }

  type RuleList = {
    data?: RuleListItem[]
    /** 列表的内容总数 */
    total?: number
    success?: boolean
  }

  type FakeCaptcha = {
    code?: number
    status?: string
  }

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string
    /** 业务上的错误信息 */
    errorMessage?: string
    /** 业务上的请求是否成功 */
    success?: boolean
  }

  type NoticeIconList = {
    data?: NoticeIconItem[]
    /** 列表的内容总数 */
    total?: number
    success?: boolean
  }

  type NoticeIconItemType = 'notification' | 'message' | 'event'

  type NoticeIconItem = {
    id?: string
    extra?: string
    key?: string
    read?: boolean
    avatar?: string
    title?: string
    status?: string
    datetime?: string
    description?: string
    type?: NoticeIconItemType
  }
}
