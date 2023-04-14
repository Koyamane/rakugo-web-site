/*
 * @Author: dingyun
 * @Date: 2023-02-28 13:00:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-01 15:15:53
 * @Description:
 */
import { request } from 'umi'

export const FollowSomeBodyApi = (targetId: string, userId?: string) => {
  return request('/follow/api/follow', {
    method: 'put',
    data: { targetId, userId }
  })
}

export const IsFollowedApi = (targetId: string) => {
  return request('/follow/api/follow/status', {
    method: 'get',
    params: { targetId }
  })
}
