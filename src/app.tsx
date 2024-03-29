/*
 * @Author: dingyun
 * @Date: 2023-04-10 11:46:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-07-17 15:48:29
 * @Description:
 */
import {
  AvatarDropdown,
  Footer,
  HeaderSearch,
  PostArticle,
  SelectLang,
  ThemeIcon
} from '@/components'
import { ProLayoutProps } from '@ant-design/pro-components'
import { RunTimeLayoutConfig } from '@umijs/max'
import { ReactNode } from 'react'
import defaultSettings from '../config/defaultSettings'
import Page403 from './pages/Exception/403'
import RenderApp from './RenderApp'
import { errorConfig } from './requestErrorConfig'
import { GetCrsfKey, GetUserInfo } from './services/global'
import { BgImageInfoApi } from './pages/Admin/WebsiteBgManagement/service'
// const isDev = process.env.NODE_ENV === 'development';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  bgUrl?: string
  loading?: boolean
  settings?: ProLayoutProps
  currentUser?: API.UserInfo
  fetchUserInfo?: () => Promise<API.UserInfo | undefined>
}> {
  try {
    // 这个有可能过期的，所以每次都要拿
    const res = await GetCrsfKey()
    sessionStorage.setItem('csrfToken', res)
  } catch (error) {
    console.log(error)
  }

  const fetchUserInfo = async () => {
    try {
      const userInfo: API.UserInfo = await GetUserInfo()
      return userInfo
    } catch (error) {
      localStorage.removeItem('token')
      console.log(error)
    }
    return undefined
  }

  let bgUrl = ''

  try {
    const bgInfo = await BgImageInfoApi({ position: 'WEBSITE' })
    bgUrl = bgInfo?.imgUrl || ''
  } catch (error) {
    console.log(error)
  }

  defaultSettings.navTheme = (localStorage.getItem('navTheme') as any) || defaultSettings.navTheme
  if (defaultSettings.token) {
    defaultSettings.token.bgLayout = defaultSettings.navTheme === 'light' ? '#f5f5f5' : '#000000'
  }

  // 不是登录页面且有token时，就获取用户信息
  if (location.pathname !== '/user/login' && localStorage.getItem('token')) {
    const currentUser = await fetchUserInfo()
    return {
      fetchUserInfo,
      bgUrl,
      currentUser,
      settings: defaultSettings as ProLayoutProps
    }
  }

  return {
    fetchUserInfo,
    bgUrl,
    settings: defaultSettings as ProLayoutProps
  }
}

// ProLayout 支持的 api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    pageTitleRender(props, defaultPageTitle, info) {
      switch (info?.id) {
        case '':
        case 'menu.article':
        case 'menu.account':
        case 'menu.account.center':
          return ''
        default:
          break
      }

      const { title, formatMessage } = props
      const titleSuffix =
        (formatMessage && formatMessage({ id: 'pages.layouts.site.title' })) || title || '落語'

      if (info?.id === 'menu.home') {
        return titleSuffix
      }

      return info?.pageName + ' - ' + titleSuffix
    },
    // 在这里设置 layout 图片背景
    bgLayoutImgList: initialState?.bgUrl
      ? [
          {
            src: initialState.bgUrl,
            width: '101%',
            height: '100%',
            objectFit: 'cover',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }
        ]
      : [],
    // headerRender({ token, navTheme }, defaultDom) {
    //   const style = {
    //     height: '100%',
    //     background: navTheme === 'realDark' ? '#141414' : token.bgLayout
    //   }
    //   return <div style={style}>{defaultDom}</div>
    // },
    headerTitleRender: logo => <a>{logo}</a>,
    style: { background: initialState?.settings?.token?.bgLayout },
    actionsRender: () => [
      <HeaderSearch key='HeaderSearch' />,
      <PostArticle key='PostArticle' />,
      <ThemeIcon key='ThemeIcon' />,
      <SelectLang key='SelectLang' />
    ],
    onCollapse: collapsed => {
      if (!collapsed) {
        document.body.setAttribute('style', 'overflow: hidden')
      } else {
        document.body.removeAttribute('style')
      }
    },
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu>{avatarChildren}</AvatarDropdown>
      }
    },
    contentStyle: { padding: 0 },
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    // onPageChange: () => {
    //   const { location } = history;
    //   // 如果没有登录，重定向到 login
    //   if (!initialState?.currentUser && location.pathname !== loginPath) {
    //     history.push(loginPath);
    //   }
    // },
    navTheme: initialState?.settings?.navTheme,
    // menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <Page403 />,
    // 组件崩溃时
    // ErrorBoundary: (error: Error) => <ErrorBoundary>{error.children}</ErrorBoundary>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    // if (initialState?.loading) return <PageLoading />;
    // return (
    //   <>
    //     {children}
    //     {isDev && (
    //       <SettingDrawer
    //         disableUrlParams
    //         enableDarkTheme
    //         settings={initialState?.settings}
    //         onSettingChange={(settings) => {
    //           setInitialState((preInitialState) => ({
    //             ...preInitialState,
    //             settings,
    //           }));
    //         }}
    //       />
    //     )}
    //   </>
    // );
    // },
    ...initialState?.settings
  }
}

export function rootContainer(container: ReactNode) {
  // 方便所有组件和页面使用 App.useModel，使用它的组件能够更改静态方法图标颜色
  return <RenderApp>{container}</RenderApp>
}

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig
}
