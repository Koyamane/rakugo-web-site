/*
 * @Author: dingyun
 * @Date: 2022-01-01 12:19:06
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-31 17:59:53
 * @Description:
 */

export type tabKeyType = 'articles' | 'collections' | 'follows' | 'applications' | 'projects'

export interface AccountProps {
  articlesNum: number
  collectionsNum: number
  followsNum: number
  followersNum: number
  dispatch: Dispatch
}

export type AccountCenterState = Omit<AccountProps, 'dispatch'>

export interface CollectParams {
  targetId: string
  targetType: 'Blog'
}
