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
  // 这个组件里面是拿不到主题 token 的，且只会走一次
  const color = localStorage.getItem('navTheme') === 'realDark' ? '#141414' : '#f5f5f5'

  return (
    <App style={{ height: '100%', background: color }} className='render-app'>
      <ConfigProvider>{children}</ConfigProvider>
    </App>
  )
}

export default RenderApp
