export type AnnouncementInfo = {
  id?: number | string
  createdName?: string
  createdId?: string
  createdAvatar?: string
  createdDate?: string
  updateDate?: number
  title?: string
  order?: number
  status?: DataDictionary.NOTIFICATION_STATUS
  access?: DataDictionary.ACCESS_RIGHTS
}

export interface OperationItem {
  key: 'LIKE' | 'DISLIKE' | 'COLLECT' | 'COMMENT'
  icon: any
  text: number
  hint: string
}
