/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-22 15:13:16
 * @Description:
 */

import { request } from '@umijs/max'

export const BlogPageApi = (params?: API.PageParams) => {
  return request('/blog/api/page', { method: 'post', data: params })
}

export const DeleteBlogApi = (id: API.BlogInfo['id']) => {
  return request('/blog/api/delete', { method: 'delete', data: { id } })
}

export const UpdateBlogStatusApi = (
  params: Pick<API.BlogInfo, 'id' | 'status' | 'rejectReason'>
) => {
  return request('/blog/api/update/status', { method: 'put', data: params })
}
