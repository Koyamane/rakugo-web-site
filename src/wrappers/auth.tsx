/*
 * @Author: dingyun
 * @Date: 2023-04-09 14:20:57
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-08 18:56:05
 * @Description:
 */
import { Navigate, Outlet, useModel } from '@umijs/max'

export default () => {
  const { initialState } = useModel('@@initialState')

  if (initialState?.currentUser?.userId) {
    return <Outlet />
  }

  return <Navigate to={`/user/login?redirect=${location?.pathname}`} />
}
