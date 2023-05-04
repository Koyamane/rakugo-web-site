/*
 * @Author: dingyun
 * @Date: 2023-04-10 11:46:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-23 17:00:17
 * @Description:
 */
import { ProLayoutProps } from '@ant-design/pro-components'

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean
  logo?: string
} = {
  layout: 'top',
  navTheme: 'light',
  contentWidth: 'Fixed',
  colorPrimary: '#bc6048',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false, // 色弱模式
  title: '落語',
  pwa: true,
  logo: '/logo.svg',
  iconfontUrl: '',
  token: {
    // 参见 ts 声明，demo 见文档，通过 token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    colorPrimary: '#bc6048',
    bgLayout: '#f5f5f5'
  },
  splitMenus: false
}

export default Settings
