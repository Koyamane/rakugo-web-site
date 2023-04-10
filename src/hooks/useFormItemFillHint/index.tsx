/*
 * @Author: dingyun
 * @Date: 2021-12-25 13:34:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-31 21:23:36
 * @Description:
 */

import { FormattedMessage, useIntl } from '@umijs/max'
import { useCallback } from 'react'

const useFormItemFillHint = () => {
  const intl = useIntl()

  const fillHint = useCallback(
    (labelId: string) => {
      return (
        <>
          <FormattedMessage id={`pages.${labelId}`} />
          <FormattedMessage id='pages.form.hintSuffix' />
        </>
      )
    },
    [intl.locale]
  )

  return fillHint
}

export default useFormItemFillHint
