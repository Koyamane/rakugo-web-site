/*
 * @Author: dingyun
 * @Date: 2023-04-29 20:34:52
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-10 15:19:01
 * @Description:
 */

export const EDITOR: DataDictionary.Item<DataDictionary.EDITOR>[] = [
  { label: 'Rich Text', value: 'RICH_TEXT' },
  { label: 'Markdown', value: 'MARKDOWN' }
]

export const BLOG_STATUS: DataDictionary.Item<DataDictionary.BLOG_STATUS>[] = [
  { label: '待审核', value: 'REVIEWED' },
  { label: '审核通过', value: 'APPROVED' },
  { label: '驳回', value: 'REJECT' }
]

export const ACCESS: DataDictionary.Item<DataDictionary.ACCESS>[] = [
  { label: '管理员', value: 'admin' },
  { label: '用户', value: 'user' }
]

export const ACCESS_RIGHTS: DataDictionary.Item<DataDictionary.ACCESS_RIGHTS>[] = [
  { label: '所有人', value: 'all' },
  ...ACCESS
]

export const BG_IMAGE_POSITION: DataDictionary.Item<DataDictionary.BG_IMAGE_POSITION>[] = [
  { label: '网站背景', value: 'WEBSITE' },
  { label: '首页侧边标题背景', value: 'HOME_SIDE_TITLE' }
]

export const NOTIFICATION_STATUS: DataDictionary.Item<DataDictionary.NOTIFICATION_STATUS>[] = [
  { label: '有效', value: 'NOT_EXPIRED' },
  { label: '过期', value: 'EXPIRED' }
]

export const DATA_DICTIONARY_STATUS: DataDictionary.Item<DataDictionary.DATA_DICTIONARY_STATUS>[] =
  [
    { label: '有效', value: 'EFFECTIVE' },
    { label: '无效', value: 'INVALID' }
  ]

export function toObj(dataArr: any[], valueKey: string = 'value', labelKey: string = 'label') {
  const obj: Record<string, string> = {}
  dataArr.forEach(item => (obj[item[valueKey].toString()] = item[labelKey]))
  return obj
}
