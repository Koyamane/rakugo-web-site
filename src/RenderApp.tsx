/*
 * @Author: dingyun
 * @Date: 2023-04-13 20:19:26
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-13 22:02:16
 * @Description:
 */
import { App, ConfigProvider } from 'antd'
import { ReactNode } from 'react'

const RenderApp: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <App>
      <ConfigProvider>{children}</ConfigProvider>
    </App>
  )
}

export default RenderApp
