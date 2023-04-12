/*
 * @Author: dingyun
 * @Date: 2021-12-25 13:34:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-01 14:46:14
 * @Description:
 */

import { history } from '@umijs/max'
import { parse } from 'querystring'
import { useCallback } from 'react'

const useGoRedirect = () => {
  const redirect = useCallback((type: 'push' | 'replace' = 'replace') => {
    const { search } = location
    const query = parse(search)

    history[type]((query['?redirect'] as string) || '/')
  }, [])

  return redirect
}

export default useGoRedirect
