/*
 * @Author: dingyun
 * @Date: 2021-12-25 13:34:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-31 21:16:26
 * @Description:
 */

import { useIntl } from '@umijs/max'
import { useCallback } from 'react'

const usePaginationItem = () => {
  const intl = useIntl()

  const itemRender = useCallback(
    (
      current: number,
      type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
      originalElement: React.ReactNode
    ) => {
      if (type === 'prev') {
        return (
          <a>
            {intl.formatMessage({ id: 'pages.searchTable.previousPage', defaultMessage: '上一页' })}
          </a>
        )
      }
      if (type === 'next') {
        return (
          <a>
            {intl.formatMessage({ id: 'pages.searchTable.nextPage', defaultMessage: '下一页' })}
          </a>
        )
      }
      return originalElement
    },
    [intl.locale]
  )

  return itemRender
}

export default usePaginationItem
