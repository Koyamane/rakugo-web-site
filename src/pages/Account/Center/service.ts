/*
 * @Author: dingyun
 * @Date: 2022-01-01 12:19:06
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-31 18:16:38
 * @Description:
 */
import { request } from '@umijs/max'
import { CollectParams } from './data'

/**
 * @description 分页查询某用户的博文列表
 * @returns Promise
 */
export const SomebodyBlogPage = (userId: API.UserInfo['userId'], params?: API.PageParams) => {
  return request(`/blog/api/page/${userId}`, { method: 'post', data: params })
}

/**
 * @description 删除博客
 * @returns Promise
 */
export const DeleteBlogApi = (id: API.BlogInfo['id']) => {
  return request('/blog/api/delete', { method: 'delete', data: { id } })
}

/**
 * @description 博客收藏列表
 * @returns Promise
 */
export const BlogCollectionPage = (params?: API.PageParams) => {
  return request('/collection/api/page/blog', { method: 'post', data: params })
}

/**
 * @description 关注列表
 * @returns Promise
 */
export const UserFollowPage = (params?: API.PageParams) => {
  return request('/follow/api/page/watchers', { method: 'post', data: params })
}

/**
 * @description 取消收藏
 * @returns Promise
 */
export const CancelCollectionApi = (params: CollectParams) => {
  return request('/collection/api/collect', { method: 'put', data: params })
}
