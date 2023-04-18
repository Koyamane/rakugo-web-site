/*
 * @Author: dingyun
 * @Date: 2023-03-22 11:29:07
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-28 16:09:35
 * @Description:
 */

export const EDITOR: DataDictionary.Item<DataDictionary.EDITOR>[] = [
  { label: 'Rich Text', value: 'RICH_TEXT' },
  { label: 'Markdown', value: 'MARKDOWN' }
]

export const BLOG_STATUS = [
  { label: '待审核', value: 'REVIEWED' },
  { label: '审核通过', value: 'APPROVED' },
  { label: '驳回', value: 'REJECT' }
]

export const ACCESS = [
  { label: '管理员', value: 'admin' },
  { label: '用户', value: 'user' }
]

export const ACCESS_RIGHTS = [{ label: '所有人', value: 'all' }, ...ACCESS]

export const NOTIFICATION_STATUS = [
  { label: '有效', value: 'NOT_EXPIRED' },
  { label: '过期', value: 'EXPIRED' }
]

export const DATA_DICTIONARY_STATUS = [
  { label: '有效', value: 'EFFECTIVE' },
  { label: '无效', value: 'INVALID' }
]

export function toObj(dataArr: DataDictionary.Item[]) {
  const obj: Record<string, string> = {}
  dataArr.forEach(item => (obj[item.value.toString()] = item.label))
  return obj
}
