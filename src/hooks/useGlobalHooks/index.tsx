/*
 * @Author: dingyun
 * @Date: 2023-04-21 22:16:16
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-28 12:48:40
 * @Description:
 */

import { OperationItem } from '@/pages/Post/Article/data'
import { useIntl, useModel } from '@umijs/max'

const useGlobalHooks = () => {
  const intl = useIntl()
  const { dataDictionaryObj } = useModel('useDataDictionary')

  const formatValue = (obj: Record<string, any>, key: string = 'value') => {
    return obj[`${key}_${intl.locale.substring(0, 2)}`] || obj[key]
  }

  const formatOptions = (
    list: any[] = [],
    value: string = 'key',
    label: string = 'value',
    toValue: string = 'value',
    toLabel: string = 'label'
  ): any[] => {
    return list.map(item => ({
      [toValue]: item[value],
      [toLabel]: formatValue(item, label)
    }))
  }

  const keyToValue = (dataDictionaryKey: string, key: string) => {
    let obj = dataDictionaryObj
    if (!obj[dataDictionaryKey]) return ''
    const targetObj: any = obj[dataDictionaryKey].find((item: any) => item.key === key) || {}
    return targetObj[`value_${intl.locale.substring(0, 2)}`] ?? ''
  }

  const isIncludeMe = (
    type: OperationItem['key'],
    blogDataArr: API.BlogDataItem[],
    id?: string
  ) => {
    if (!id) return false
    if (blogDataArr?.length <= 0) return false
    const blogDataObj = blogDataArr[0]

    let flag = false
    switch (type) {
      case 'LIKE':
        flag = blogDataObj.likeArr.includes(id)
        break
      case 'DISLIKE':
        flag = blogDataObj.dislikeArr.includes(id)
        break
      case 'COLLECT':
        flag = blogDataObj.collectionArr.includes(id)
        break
      default:
        break
    }
    return flag
  }

  return {
    isIncludeMe,
    keyToValue,
    formatValue,
    formatOptions
  }
}

export default useGlobalHooks
