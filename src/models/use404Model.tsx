/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 15:36:50
 * @Description:
 */
import { useState } from 'react'

export default function use404Model() {
  const [to404, setTo404] = useState(false)

  return {
    to404,
    setTo404
  }
}
