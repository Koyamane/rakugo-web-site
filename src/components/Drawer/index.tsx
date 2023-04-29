/*
 * @Author: dingyun
 * @Date: 2023-04-28 11:09:26
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-29 13:30:40
 * @Description:
 */

import { Drawer, DrawerProps } from 'antd'
import React, { useEffect } from 'react'

const Drawer2: React.FC<DrawerProps> = ({ children, afterOpenChange, ...resetProps }) => {
  const handleAfter = (flag: boolean) => {
    if (flag) {
      let stylee = document.createElement('style')
      stylee.type = 'text/css'
      stylee.id = 'hidden_body_overflow'
      let sHtml = 'html body { overflow: hidden; }'
      stylee.innerHTML = sHtml
      document.getElementsByTagName('head')?.item(0)?.appendChild(stylee)
    } else {
      document.getElementById('hidden_body_overflow')?.remove()
    }

    afterOpenChange && afterOpenChange(flag)
  }

  useEffect(() => {
    return () => {
      document.getElementById('hidden_body_overflow')?.remove()
    }
  }, [])

  return (
    <Drawer {...resetProps} afterOpenChange={handleAfter}>
      {children}
    </Drawer>
  )
}

export default Drawer2
