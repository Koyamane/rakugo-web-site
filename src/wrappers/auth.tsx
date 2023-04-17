/*
 * @Author: dingyun
 * @Date: 2023-04-09 14:20:57
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-17 23:14:08
 * @Description:
 */
import { Navigate, Outlet } from '@umijs/max'

export default () => {
  if (localStorage.getItem('token')) {
    return <Outlet />
  }

  return <Navigate to={`/user/login?redirect=${location?.pathname}`} />
}
