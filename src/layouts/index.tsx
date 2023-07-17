/*
 * @Author: dingyun
 * @Date: 2023-04-10 15:36:32
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-07-17 16:58:06
 * @Description:
 */
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Helmet, Outlet, useModel } from '@umijs/max'
import { useEffect } from 'react'
import Page404 from '../pages/Exception/404'

export default function Layout() {
  const { to404, setTo404 } = useModel('use404Model')
  const { pathname } = location

  const layoutClassName = useEmotionCss(({ token }) => {
    return {
      width: '100%',
      marginInline: 'auto',
      padding: token.paddingMD,
      maxWidth: (token as any).pageMaxWidth,

      [`@media screen and (max-width: ${token.screenMD}px)`]: {
        '&.page-layout': {
          paddingInline: token.paddingSM
        }
      }
    }
  })

  useEffect(() => {
    setTo404(false)
  }, [pathname])

  return (
    <div className={layoutClassName + ' page-layout'}>
      <Helmet>
        <meta name='keywords' content='rakugo,koyamane,落語,小山音' />
        <meta
          name='description'
          property='og:description'
          content='你轻轻地来，诉说着往事，留下一段佳话'
        />
      </Helmet>
      {to404 ? <Page404 /> : <Outlet />}
    </div>
  )
}
