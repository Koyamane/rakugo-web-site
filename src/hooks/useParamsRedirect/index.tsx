/*
 * @Author: dingyun
 * @Date: 2021-12-25 13:34:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-01 14:46:14
 * @Description:
 */

import { history, useIntl } from '@umijs/max'
import { App } from 'antd'
import { stringify } from 'querystring'
import { useCallback } from 'react'

const useParamsRedirect = () => {
  const intl = useIntl()
  const { message } = App.useApp()

  const redirect = useCallback(
    (
      props: {
        isNotHint?: boolean
        url?: string
        params?: Record<string, string>
        hintId?: string
        hintStr?: string
      } = {}
    ) => {
      const { search, pathname } = location
      const { isNotHint, url, params, hintId, hintStr } = props

      !isNotHint &&
        message.info(
          intl.formatMessage({
            id: hintId || 'pages.login.hint',
            defaultMessage: hintStr || '请先登录'
          })
        )

      history.push({
        pathname: url || '/user/login',
        search: stringify(
          params || {
            redirect: pathname + search
          }
        )
      })
    },
    [intl.locale]
  )

  return redirect
}

export default useParamsRedirect
