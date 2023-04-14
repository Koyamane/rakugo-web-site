/*
 * @Author: dingyun
 * @Date: 2023-04-10 15:36:32
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 11:45:35
 * @Description:
 */
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Outlet, useModel } from '@umijs/max'
import { useEffect } from 'react'
import Page404 from '../pages/Exception/404'

export default function Layout() {
  const { to404, setTo404 } = useModel('use404Model')
  const { pathname } = location

  const layoutClassName = useEmotionCss(({ token }) => {
    return {
      width: '100%',
      maxWidth: token.pageMaxWidth,
      padding: token.paddingMD,
      marginInline: 'auto'
    }
  })

  useEffect(() => {
    setTo404(false)
  }, [pathname])

  return <div className={layoutClassName}>{to404 ? <Page404 /> : <Outlet />}</div>
}
