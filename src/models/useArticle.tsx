/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 15:36:18
 * @Description:
 */
import { useState } from 'react'

export default function useArticle() {
  const [followed, setFollowed] = useState(false)

  return {
    followed,
    setFollowed
  }
}
