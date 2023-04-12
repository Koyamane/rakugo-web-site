export interface LoginParams {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterParams {
  username: string
  password: string
  confirm?: string
  captcha?: string
}
