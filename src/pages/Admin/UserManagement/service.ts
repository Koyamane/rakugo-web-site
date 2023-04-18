/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 12:15:28
 * @Description:
 */

import { request } from '@umijs/max'

export const UserPageApi = (params?: API.PageParams) => {
  return request('/user/api/page', { method: 'post', data: params })
}

export const DeleteUserApi = (userId: API.UserInfo['userId']) => {
  return request('/user/api/delete', { method: 'delete', data: { userId } })
}

export const UpdateUesrAccessApi = (params: Pick<API.UserInfo, 'userId' | 'access'>) => {
  return request('/user/api/update/access', { method: 'put', data: params })
}
