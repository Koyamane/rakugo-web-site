declare namespace DataDictionary {
  type Item<T = string | number | boolean> = {
    label: string
    value: T
  }

  type EDITOR = 'RICH_TEXT' | 'MARKDOWN'
  type ACCESS = 'admin' | 'user'
  type ACCESS_RIGHTS = 'all' | ACCESS
  type BLOG_STATUS = 'REVIEWED' | 'APPROVED' | 'REJECT'
  type DATA_DICTIONARY_STATUS = 'EFFECTIVE' | 'INVALID'
  type NOTIFICATION_STATUS = 'NOT_EXPIRED' | 'EXPIRED'
  type BG_IMAGE_POSITION = 'WEBSITE' | 'HOME_SIDE_TITLE'
}
