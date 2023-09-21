/*
 * @Author: dingyun
 * @Date: 2023-04-13 20:19:26
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-01 20:29:47
 * @Description:
 */
import { useToken } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { getLocale } from '@umijs/max'
import { App,ConfigProvider } from 'antd'
import { ReactNode } from 'react'

const RenderApp: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 这个组件里面是拿不到主题 token 的，且只会走一次
  const color = localStorage.getItem('navTheme') === 'realDark' ? '#141414' : '#f5f5f5'
  const { token } = useToken()

  const appClassName = useEmotionCss(() => ({
    height: '100%',
    background: color
  }))

  const fontFamily = getLocale() === 'ja-JP' ? `'Yu Gothic UI', ${token.fontFamily}` : token.fontFamily

  return (
    <App className={appClassName}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily
          }
        }}
      >
        {children}
      </ConfigProvider>
    </App>
  )
}

export default RenderApp
