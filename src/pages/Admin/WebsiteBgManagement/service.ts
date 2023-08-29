/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-10 13:49:37
 * @Description:
 */

import { request } from '@umijs/max'
import { BgImageInfo } from './data'

const formatParams = (params: BgImageInfo): FormData => {
  const formData = new FormData()

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key]
      formData.append(key, element)
    }
  }

  return formData
}

export const BgImagePageApi = (params?: API.PageParams) => {
  return request('/bgImage/api/page', { method: 'post', data: params })
}

export const BgImageAddApi = (params: BgImageInfo) => {
  return request('/bgImage/api/add', { method: 'post', data: formatParams(params) })
}

export const BgImageUpdateApi = (params: BgImageInfo) => {
  return request('/bgImage/api/update', { method: 'put', data: formatParams(params) })
}

export const BgImageDeleteApi = (id: BgImageInfo['id']) => {
  return request('/bgImage/api/delete', { method: 'delete', data: { id } })
}

export const BgImageInfoApi = (params?: Pick<BgImageInfo, 'id' | 'order' | 'position'>) => {
  return request('/bgImage/api/info', { method: 'get', params })
}
