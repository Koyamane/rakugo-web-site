import { request } from '@umijs/max'
import { LoginParams, RegisterParams } from './data'

/**
 * @description 登录
 * @returns 返回当前用户信息以及token
 */
export const LoginApi = (params: LoginParams) => {
  return request('/user/api/login', { method: 'post', data: params })
}

/**
 * @description 注册
 * @returns 返回当前用户信息以及token
 */
export const RegisterApi = (params: RegisterParams) => {
  return request('/user/api/register', { method: 'post', data: params })
}
