import type { RequestConfig, RequestOptions } from '@@/plugin-request/request'
import { history } from '@umijs/max'
import { message, notification } from 'antd'
import { stringify } from 'querystring'

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户登录已过期，需要重新登录。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9
}

// 与后端约定的响应数据格式，后台必须严格遵守
interface ResponseStructure {
  success: boolean
  data: any
  errorCode: number
  statusText?: string
  errorMessage?: string
  showType?: ErrorShowType
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  baseURL: '/api',
  timeout: 60000,
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出，当且仅当后台返回的 data 中 success 为 false 时启用
    errorThrower: res => {
      const { success, data, errorCode, errorMessage, statusText, showType } =
        res as unknown as ResponseStructure
      if (!success) {
        const errorText = errorMessage || data?.msg || codeMessage[errorCode] || statusText
        const error: any = new Error(errorText)
        error.name = 'BizError'
        error.info = { errorCode, errorMessage: errorText, showType, data }
        throw error // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // 发请求时设置的跳过错误处理
      if (opts?.skipErrorHandler) throw error

      if (error.response && error.response.status === 401) {
        const { data = {}, status, statusText } = error.response
        const { search, pathname } = location

        const errorMessage = data?.msg || codeMessage[status] || statusText || error.message

        notification.warning({
          message: '提示',
          description: errorMessage
        })

        localStorage.removeItem('token')

        if (pathname !== '/user/login') {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: pathname + search
            })
          })
        }

        throw error
      }

      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info

        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo

          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // 不需要提示，可以在这里做相应的处理
              break
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage)
              break
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage)
              break
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode
              })
              break
            case ErrorShowType.REDIRECT:
              // 跳转到哪个页面
              break
            default:
              message.error(errorMessage)
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        const errorMessage = error.response.data?.msg || error.response.statusText
        message.error(`${errorMessage}`)
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.')
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.')
      }
    }
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const Authorization = localStorage.getItem('token')
      const csrfToken = sessionStorage.getItem('csrfToken')
      let headers: any = {
        ...config.headers,
        'x-csrf-token': csrfToken
      }
      if (Authorization) {
        headers = {
          ...headers,
          Authorization: `Bearer ${Authorization}`
        }
      }

      return { ...config, headers }
    }
  ],

  // 响应拦截器
  responseInterceptors: [
    response => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure
      return data?.data ? data : response
    }
  ]
}
