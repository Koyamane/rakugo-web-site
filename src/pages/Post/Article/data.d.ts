/*
 * @Author: dingyun
 * @Date: 2021-12-25 16:34:33
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-31 15:52:03
 * @Description:
 */

export interface BlogDataContentProps {
  blogInfo: API.BlogInfo
  userId?: string
}

export interface OperationItem {
  key: 'LIKE' | 'DISLIKE' | 'COLLECT' | 'COMMENT'
  icon: any
  text: number
  hint: string
}

export interface OperationRes {
  status:
    | 'CANT_ONESELF'
    | 'LIKE'
    | 'CANCEL_LIKE'
    | 'DISLIKE'
    | 'CANCEL_DISLIKE'
    | 'COLLECT'
    | 'CANCEL_COLLECT'
  arr: string[]
}
