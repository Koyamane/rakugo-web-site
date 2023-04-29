import { request } from '@umijs/max'

export const BlogPageApi = (params?: API.PageParams) => {
  return request('/blog/api/page', { method: 'post', data: params })
}
