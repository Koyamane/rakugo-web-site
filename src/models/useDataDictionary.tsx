/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 21:37:08
 * @Description:
 */
import { DataDictionaryPageApi } from '@/pages/Admin/DataDictionaryManagement/service'
import { getLocale } from '@umijs/max'
import { useCallback, useState } from 'react'

export default function useDataDictionary() {
  const locale = getLocale()
  const [dataDictionaryObj, setDataDictionaryObj] = useState<
    Record<string, API.DataDictionaryItem[]>
  >({})

  const formatDataDictionaryList = (list: API.DataDictionaryInfo[]) => {
    if (!list.length) return dataDictionaryObj

    const obj = dataDictionaryObj

    list.forEach(item => {
      if (!obj[item.key]) {
        // 需要按照 order 排序
        const arr = [...item.datas]

        arr.sort((pre, next) => {
          // a - b升，b - a降
          return pre.order - next.order
        })

        obj[item.key] = arr
      }
    })
    setDataDictionaryObj(obj)

    return obj
  }

  const formatOptions = (list: any[] = [], value: string = 'key', label: string = 'value') => {
    return list.map(item => ({
      value: item[value],
      label: item[`${label}_${locale.substring(0, 2)}`]
    }))
  }

  const getDataDictionary = useCallback(
    async (keys?: string[], cb?: (obj: Record<string, API.DataDictionaryItem[]>) => void) => {
      if (!keys?.length) return

      try {
        const res = await DataDictionaryPageApi({
          pageSize: keys.length,
          searchMap: { key: { opt: 'IN', value: keys.join(',') } }
        })

        const obj = formatDataDictionaryList(res.list)

        cb && cb(obj)

        return obj
      } catch (error) {}

      return
    },
    []
  )

  const keyToValue = (dataDictionaryKey: string, key: string) => {
    let obj = dataDictionaryObj
    if (!obj[dataDictionaryKey]) return
    const targetObj: any = obj[dataDictionaryKey].find((item: any) => item.key === key) || {}
    return targetObj[`value_${locale.substring(0, 2)}`]
  }

  return {
    keyToValue,
    formatOptions,
    dataDictionaryObj,
    getDataDictionary,
    setDataDictionary: formatDataDictionaryList
  }
}
