/*
 * @Author: dingyun
 * @Date: 2023-04-10 11:46:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-11 22:32:51
 * @Description:
 */
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.UserInfo } | undefined) {
  const { currentUser } = initialState ?? {}
  return {
    canAdmin: currentUser ? currentUser.access === 'admin' : false
  }
}
