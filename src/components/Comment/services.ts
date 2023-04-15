import { request } from '@umijs/max'
import { CommentAddParams, CommentDeleteParams, CommentLikeParams } from './data'

export const CommentPageApi = (params: API.PageParams) => {
  return request('/comment/api/page', { method: 'post', data: params })
}

export const CommentApi = (params: CommentAddParams) => {
  return request('/comment/api/comment', {
    method: 'post',
    data: params
  })
}

export const CommentLikeApi = (params: CommentLikeParams) => {
  return request('/comment/api/like', {
    method: 'post',
    data: params
  })
}

export const CommentDeleteApi = (params: CommentDeleteParams) => {
  return request('/comment/api/delete', {
    method: 'delete',
    data: params
  })
}
