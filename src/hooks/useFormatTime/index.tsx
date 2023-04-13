/*
 * @Author: dingyun
 * @Date: 2021-12-25 13:34:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-13 12:13:49
 * @Description:
 */

import { getLocale, useIntl } from '@umijs/max'
import moment from 'moment'
import { useCallback } from 'react'

const useFormatTime = (isFull?: boolean, day?: number) => {
  const intl = useIntl()
  moment.locale(getLocale())

  // 格式化时间显示
  const formatTime = useCallback(
    (date: string, day2?: number) => {
      if (isFull) return moment(date).format('YYYY-MM-DD HH:mm:ss')

      const day3 = day || day2
      if (day3) {
        const lastDate = new Date(date).getTime()
        const time = 1000 * 60 * 60 * 24 * day3
        if (Date.now() - lastDate > time) {
          return moment(date).format('YYYY-MM-DD HH:mm:ss')
        }
      }

      return moment(date).fromNow()
    },
    [intl.locale]
  )

  return formatTime
}

export default useFormatTime
