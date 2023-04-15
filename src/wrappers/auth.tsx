/*
 * @Author: dingyun
 * @Date: 2023-04-09 14:20:57
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-11 22:21:58
 * @Description:
 */
import { Navigate, Outlet, useModel } from '@umijs/max'

export default () => {
  const { initialState } = useModel('@@initialState')

  if (initialState?.currentUser?.userId) {
    return (
      <div className='aaaaaaaaaaaaaaaa'>
        <Outlet />
      </div>
    )
  }

  return <Navigate to={`/user/login?redirect=${location?.pathname}`} />
}
