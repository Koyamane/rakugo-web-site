export interface LoginParams {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
}

export interface RegisterParams {
  username: string
  password: string
  confirm?: string
  captcha?: string
}
