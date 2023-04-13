/*
 * @Author: dingyun
 * @Date: 2021-12-21 19:51:35
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-12 23:00:03
 * @Description:
 */
import { request } from '@umijs/max'

export const BlogPageApi = (params?: API.PageParams) => {
  return request('/blog/api/page', { method: 'post', data: params })
}

export const AnnouncementPageApi = (params?: API.PageParams) => {
  return request('/notification/api/page', { method: 'post', data: params })
}
