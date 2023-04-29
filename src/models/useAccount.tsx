/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-20 14:24:07
 * @Description:
 */
import { useState } from 'react'

export default function useAccount() {
  const [nums, setNums] = useState({
    articlesNum: 0,
    collectionsNum: 0,
    followsNum: 0,
    followersNum: 0
  })

  return {
    nums,
    setNums
  }
}
