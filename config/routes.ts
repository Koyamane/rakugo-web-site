/*
 * @Author: dingyun
 * @Date: 2023-04-12 19:25:38
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-29 21:21:11
 * @Description:
 */
/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/',
    icon: 'home',
    name: 'home',
    component: './Home'
  },
  {
    path: '/search',
    name: 'search',
    hideInMenu: true,
    component: './Search'
  },
  {
    path: '/article/:id',
    name: 'article',
    hideInMenu: true,
    component: './Post/Article'
  },
  {
    path: '/post',
    name: 'post',
    layout: false,
    hideInMenu: true,
    component: './Post/New',
    routes: [
      {
        path: '/post',
        redirect: '/post/md'
      },
      {
        path: '/post/md',
        name: 'markdown',
        wrappers: ['@/wrappers/auth'],
        component: './Post/New/components/MarkdownEditor'
      },
      {
        path: '/post/md/:id',
        name: 'markdown',
        wrappers: ['@/wrappers/auth'],
        component: './Post/New/components/MarkdownEditor'
      },
      {
        path: '/post/rt',
        name: 'richtext',
        wrappers: ['@/wrappers/auth'],
        component: './Post/New/components/RichtextEditor'
      },
      {
        path: '/post/rt/:id',
        name: 'rich_text',
        wrappers: ['@/wrappers/auth'],
        component: './Post/New/components/RichtextEditor'
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        component: './Exception/404'
      },
      {
        path: '/admin/announcement',
        name: 'announcement',
        component: './Admin/AnnouncementManagement'
      },
      {
        path: '/admin/blog',
        name: 'blog',
        component: './Admin/BlogManagement'
      },
      {
        path: '/admin/user',
        name: 'user',
        component: './Admin/UserManagement'
      },
      {
        path: '/admin/data-dictionary',
        name: 'dataDictionary',
        component: './Admin/DataDictionaryManagement'
      }
    ]
  },
  {
    path: '/user',
    layout: false,
    hideInMenu: true,
    component: './User',
    routes: [
      {
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login'
      },
      {
        path: '/user/register',
        name: 'register',
        component: './User/Register'
      },
      {
        path: '/user/register/result',
        name: 'register-result',
        component: './User/RegisterResult'
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    hideInMenu: true,
    routes: [
      {
        path: '/account',
        component: './Exception/404'
      },
      {
        path: '/account/center',
        wrappers: ['@/wrappers/auth'],
        component: './Account/Center'
      },
      {
        path: '/account/center/:userId',
        name: 'center',
        component: './Account/Center'
      },
      {
        path: '/account/settings',
        name: 'settings',
        wrappers: ['@/wrappers/auth'],
        component: './Account/Settings'
      }
    ]
  },
  {
    path: '*',
    component: './Exception/404'
  }
]
