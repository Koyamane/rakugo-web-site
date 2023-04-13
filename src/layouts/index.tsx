/*
 * @Author: dingyun
 * @Date: 2023-04-10 15:36:32
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-13 09:54:39
 * @Description:
 */
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Outlet } from '@umijs/max'

export default function Layout() {
  const layoutClassName = useEmotionCss(({ token }) => {
    return {
      width: '100%',
      maxWidth: '1152px',
      padding: token.paddingMD,
      marginInline: 'auto'
    }
  })

  return (
    <div className={layoutClassName}>
      <Outlet />
    </div>
  )
}
