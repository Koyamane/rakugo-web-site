/*
 * @Author: dingyun
 * @Date: 2023-04-21 22:16:16
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-26 11:17:18
 * @Description:
 */

import { useIntl, useModel } from '@umijs/max'

const useGlobalHooks = () => {
  const intl = useIntl()
  const { dataDictionaryObj } = useModel('useDataDictionary')

  const formatValue = (obj: Record<string, any>, key: string = 'value') => {
    return obj[`${key}_${intl.locale.substring(0, 2)}`] || obj[key]
  }

  const formatOptions = (list: any[] = [], value: string = 'key', label: string = 'value') => {
    return list.map(item => ({
      value: item[value],
      label: formatValue(item, label)
    }))
  }

  const keyToValue = (dataDictionaryKey: string, key: string) => {
    let obj = dataDictionaryObj
    if (!obj[dataDictionaryKey]) return ''
    const targetObj: any = obj[dataDictionaryKey].find((item: any) => item.key === key) || {}
    return targetObj[`value_${intl.locale.substring(0, 2)}`] ?? ''
  }

  return {
    keyToValue,
    formatValue,
    formatOptions
  }
}

export default useGlobalHooks
