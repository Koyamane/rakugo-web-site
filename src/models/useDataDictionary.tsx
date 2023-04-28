/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-28 11:49:47
 * @Description:
 */
import { DataDictionaryPageApi } from '@/pages/Admin/DataDictionaryManagement/service'
import { useCallback, useState } from 'react'

export default function useDataDictionary() {
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

    setDataDictionaryObj({ ...obj })

    return obj
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

  return {
    dataDictionaryObj,
    getDataDictionary,
    setDataDictionary: formatDataDictionaryList
  }
}
