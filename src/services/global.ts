/*
 * @Author: dingyun
 * @Date: 2021-12-24 23:56:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-11 23:10:20
 * @Description:
 */
import { request } from '@umijs/max'

/**
 * @description 拿到crsf token，不然post请求发送不了，egg的安全策略
 * @returns Promise
 */
export const GetCrsfKey = () => {
  return request('/home/api/crsf')
}

/**
 * @description 获取用户信息，没有 userId 就获取当前用户
 * @returns Promise
 */
export const GetUserInfo = (userId?: string | number) => {
  return request('/user/api/info', { method: 'post', data: { userId } })
}

/**
 * @description 更新当前用户信息
 * @returns Promise
 */
export const UpdateCurrentUser = (params: API.UpdateCurrentUser) => {
  return request('/user/api/current/update', { method: 'put', data: params })
}

/**
 * @description 退出登录
 * @returns Promise
 */
export const LogOutApi = () => {
  return request('/user/api/logOut')
}

/**
 * @description 上传图片
 * @returns Promise
 */
export const UploadFile = (params: { filePrefix: string; file: File }) => {
  const formData = new FormData()

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      formData.append(key, params[key])
    }
  }

  return request('/file/api/upload', { method: 'post', data: formData })
}

/**
 * @description 删除单张或多张图片
 * @returns Promise
 */
export const DeleteFile = (params: string[]) => {
  return request('/file/api/delete', { method: 'delete', data: params })
}
