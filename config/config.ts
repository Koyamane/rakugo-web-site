import { defineConfig } from '@umijs/max'
import defaultSettings from './defaultSettings'
import proxy from './proxy'
import routes from './routes'
// https://umijs.org/config/

const { REACT_APP_ENV = 'dev' } = process.env

export default defineConfig({
  esbuildMinifyIIFE: true,
  codeSplitting: {
    jsStrategy: 'granularChunks'
  },
  /**
   * @name 开启 hash 模式
   * @description 让 build 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存。
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,
  outputPath: 'rakugo',
  /**
   * @name 兼容性设置
   * @description 设置 ie11 不一定完美兼容，需要检查自己使用的所有依赖
   * @doc https://umijs.org/docs/api/config#targets
   */
  // targets: {
  //   ie: 11,
  // },
  /**
   * @name 路由的配置，不在路由中引入的文件不会编译
   * @description 只支持 path，component，routes，redirect，wrappers，title 的配置
   * @doc https://umijs.org/docs/guides/routes
   */
  // umi routes: https://umijs.org/docs/routing
  routes,
  /**
   * @name 主题的配置
   * @description 虽然叫主题，但是其实只是 less 的变量设置
   * @doc antd的主题设置 https://ant.design/docs/react/customize-theme-cn
   * @doc umi 的theme 配置 https://umijs.org/docs/api/config#theme
   */
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    'root-entry-name': 'variable',
    '@primary-color': '#bc6048'
  },
  /**
   * @name moment 的国际化配置
   * @description 如果对国际化没有要求，打开之后能减少js的包大小
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,
  /**
   * @name 代理配置
   * @description 可以让你的本地服务器代理到你的服务器上，这样你就可以访问服务器的数据了
   * @see 要注意以下 代理只能在本地开发时使用，build 之后就无法使用了。
   * @doc 代理介绍 https://umijs.org/docs/guides/proxy
   * @doc 代理配置 https://umijs.org/docs/api/config#proxy
   */
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  /**
   * @name 快速热更新配置
   * @description 一个不错的热更新组件，更新时可以保留 state
   */
  fastRefresh: true,
  //============== 以下都是max的插件配置 ===============
  /**
   * @name 数据流插件
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * 一个全局的初始数据流，可以用它在插件之间共享数据
   * @description 可以用来存放一些全局的数据，比如用户信息，或者一些全局的状态，全局初始状态在整个 Umi 项目的最开始创建。
   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @name layout 插件
   * @doc https://umijs.org/docs/max/layout-menu
   */
  // title: '落語',
  favicons: ['/logo.svg'],
  // metas: [
  //   { name: 'keywords', content: 'rakugo,koyamane,落語,小山音' },
  //   { name: 'description', content: '小山音倾力打造' },
  //   { name: 'description', content: '你轻轻地来，诉说着往事，留下一段佳话' },
  //   { name: 'apple-mobile-web-app-title', content: '落語' }
  // ],
  links: [
    // 苹果相关的
    { rel: 'bookmark', href: '/favicon.png' },
    { rel: 'apple-touch-icon', href: '/favicon.png' },
    { rel: 'apple-touch-icon', href: '/favicon.png', sizes: '152x152' },
    { rel: 'apple-touch-icon', href: '/favicon.png', sizes: '120x120' },
    { rel: 'apple-touch-icon', href: '/favicon.png', sizes: '76x76' },
    { rel: 'apple-touch-icon', href: '/favicon.png', sizes: '60x60' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.png' },
    { rel: 'apple-touch-icon-precomposed', href: '/favicon.png', sizes: '180x180' }
  ],
  layout: {
    locale: true,
    ...defaultSettings
  },
  /**
   * @name moment2dayjs 插件
   * @description 将项目中的 moment 替换为 dayjs
   * @doc https://umijs.org/docs/max/moment2dayjs
   */
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration']
  },
  /**
   * @name 国际化插件
   * @doc https://umijs.org/docs/max/i18n
   */
  locale: {
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true
  },
  /**
   * @name antd 插件
   * @description 内置了 babel import 插件
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {
    theme: {
      token: {
        pageMaxWidth: 1152,
        colorBgLayoutHeader: 'rgba(255, 255, 255, 0.6)',
        colorPrimary: '#bc6048',
        colorInfo: '#bc6048' // 可以改到 a 标签的颜色，和 massage 的标签颜色
      }
    }
  },
  /**
   * @name 网络请求配置
   * @description 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
   * @doc https://umijs.org/docs/max/request
   */
  request: {},
  /**
   * @name 权限插件
   * @description 基于 initialState 的权限插件，必须先打开 initialState
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  /**
   * @name <head> 中额外的 script
   * @description 配置 <head> 中额外的 script
   */
  headScripts: [
    // 解决首次加载时白屏的问题
    { src: '/scripts/loading.js', async: true }
  ],
  //================ pro 插件配置 =================
  presets: ['umi-presets-pro'],
  mfsu: {
    strategy: 'normal'
  },
  requestRecord: {}
})
