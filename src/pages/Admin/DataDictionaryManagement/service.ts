/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 12:15:28
 * @Description:
 */

import { request } from '@umijs/max'

export const DataDictionaryPageApi = (params?: API.PageParams) => {
  return request('/dataDictionary/api/page', { method: 'post', data: params })
}

export const DataDictionaryAddApi = (params: Pick<API.DataDictionaryInfo, 'title' | 'key'>) => {
  return request('/dataDictionary/api/add', { method: 'post', data: params })
}

export const DataDictionaryDeleteApi = (id: API.DataDictionaryInfo['id']) => {
  return request('/dataDictionary/api/delete', { method: 'delete', data: { id } })
}

export const DataDictionaryUpdateApi = (params: Partial<API.DataDictionaryInfo>) => {
  return request('/dataDictionary/api/update', { method: 'put', data: params })
}

export const DataDictionaryInfoApi = (params: Pick<API.DataDictionaryInfo, 'key'>) => {
  return request('/dataDictionary/api/info', { method: 'put', params })
}
