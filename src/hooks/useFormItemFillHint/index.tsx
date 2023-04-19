/*
 * @Author: dingyun
 * @Date: 2021-12-25 13:34:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 22:47:21
 * @Description:
 */

import { useIntl } from '@umijs/max'
import { useCallback } from 'react'

const useFormItemFillHint = () => {
  const intl = useIntl()

  const fillHint = useCallback(
    (labelId: string, hintId?: string) => {
      if (intl.locale === 'ja-JP') {
        return (
          intl.formatMessage({ id: `pages.${labelId}` }) +
          'を' +
          intl.formatMessage({ id: `pages.form.${hintId || 'hintSuffix'}` })
        )
      }

      return (
        intl.formatMessage({ id: `pages.form.${hintId || 'hintSuffix'}` }) +
        intl.formatMessage({ id: `pages.${labelId}` })
      )
    },
    [intl.locale]
  )

  return fillHint
}

export default useFormItemFillHint
