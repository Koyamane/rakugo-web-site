/*
 * @Author: dingyun
 * @Date: 2022-01-01 12:19:06
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-20 14:34:34
 * @Description:
 */

export type tabKeyType = 'articles' | 'collections' | 'follows' | 'applications' | 'projects'

export interface CollectParams {
  targetId: string
  targetType: 'Blog'
}
