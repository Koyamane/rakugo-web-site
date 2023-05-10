/*
 * @Author: dingyun
 * @Date: 2021-12-25 16:29:46
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2021-12-25 16:47:38
 * @Description:
 */
import { request } from '@umijs/max'
import { AddBlogType } from './data'

const formatParams = (params: AddBlogType): FormData => {
  const formData = new FormData()

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key]
      formData.append(key, element)
    }
  }

  return formData
}

export const BlogAddApi = (params: AddBlogType) => {
  return request('/blog/api/add', { method: 'post', data: formatParams(params) })
}

export const BlogUpdateApi = (params: AddBlogType) => {
  return request('/blog/api/update', { method: 'put', data: formatParams(params) })
}
