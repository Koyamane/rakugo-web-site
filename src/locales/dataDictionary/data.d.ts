declare namespace DataDictionary {
  type Item<T = string | number | boolean> = {
    label: string
    value: T
  }

  type EDITOR = 'RICH_TEXT' | 'MARKDOWN'
  type ACCESS = 'admin' | 'user'
  type ACCESS_RIGHTS = 'all' | ACCESS
  type BLOG_STATUS = 'REVIEWED' | 'APPROVED' | 'REJECT'
  type NOTIFICATION_STATUS = 'NOT_EXPIRED' | 'EXPIRED'
}
