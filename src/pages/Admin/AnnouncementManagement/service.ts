/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-07 21:37:46
 * @Description:
 */

import { request } from '@umijs/max'
import { AnnouncementInfo } from './data'

/**
 * @description 分页查询通知列表
 * @returns Promise
 */
export const AnnouncementPageApi = (params?: API.PageParams) => {
  return request('/notification/api/page', { method: 'post', data: params })
}

export const AnnouncementAddApi = (params: AnnouncementInfo) => {
  return request('/notification/api/add', { method: 'post', data: params })
}

export const AnnouncementUpdateApi = (params: AnnouncementInfo) => {
  return request('/notification/api/update', { method: 'put', data: params })
}

export const AnnouncementDeleteApi = (id: AnnouncementInfo['id']) => {
  return request('/notification/api/delete', { method: 'delete', data: { id } })
}
