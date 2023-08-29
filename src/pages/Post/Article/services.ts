/*
 * @Author: dingyun
 * @Date: 2023-02-28 13:00:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-13 23:47:10
 * @Description:
 */
import { request } from '@umijs/max'

export const BlogSimplePageApi = (params?: API.PageParams) => {
  return request('/blog/api/page/simple', { method: 'post', data: params })
}

export const BlogInfoApi = (id: number | string, addRead?: number) => {
  return request('/blog/api/info', { method: 'get', params: { id, addRead } })
}

export const BlogLikeApi = (
  targetId: number | string,
  type: 'LIKE' | 'DISLIKE',
  userId?: number | string
) => {
  return request('/associationData/api/like', { method: 'put', data: { targetId, userId, type } })
}

export const BlogCollectApi = (targetId: number | string, userId?: number | string) => {
  return request('/collection/api/collect', {
    method: 'put',
    data: { targetId, userId, targetType: 'Blog' }
  })
}
