import { useGoRedirect } from '@/hooks'
import { aesEncrypt } from '@/utils/encryption'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, NavLink, useIntl, useModel } from '@umijs/max'
import { App, Row } from 'antd'
import React, { useState } from 'react'
import { LoginParams } from '../data'
import { LoginApi } from '../services'

const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState')
  const { message } = App.useApp()
  const goRedirect = useGoRedirect()
  const intl = useIntl()
  const [btnLoading, setBtnLoading] = useState(false)

  const moreBtnBarClassName = useEmotionCss(({ token }) => {
    return {
      marginBlockEnd: token.marginLG
    }
  })

  const handleSubmit = async (formData: LoginParams) => {
    try {
      setBtnLoading(true)
      // 登录
      const res = await LoginApi({
        ...formData,
        password: aesEncrypt(formData.password)
      })

      localStorage.setItem('token', res.token)
      await setInitialState(s => ({
        ...s,
        currentUser: res.userInfo
      }))

      message.success(
        intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！'
        })
      )

      goRedirect()
    } catch (error) {
      console.log(error)
      message.error(
        intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: '登录失败，请重试！'
        })
      )
      setBtnLoading(false)
    }
  }

  return (
    <LoginForm
      loading={btnLoading}
      logo={<img alt='logo' src='/logo.svg' />}
      title={intl.formatMessage({ id: 'pages.layouts.site.title' })}
      subTitle={intl.formatMessage({ id: 'pages.layouts.site.description' })}
      onFinish={handleSubmit}
    >
      <>
        <ProFormText
          name='username'
          disabled={btnLoading}
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />
          }}
          placeholder={intl.formatMessage({
            id: 'pages.login.username',
            defaultMessage: '用户名'
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.login.username.required'
                  defaultMessage='请输入用户名！'
                />
              )
            }
          ]}
        />

        <ProFormText.Password
          name='password'
          disabled={btnLoading}
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />
          }}
          placeholder={intl.formatMessage({
            id: 'pages.login.password',
            defaultMessage: '密码'
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.login.password.required'
                  defaultMessage='请输入密码！'
                />
              )
            }
          ]}
        />

        <Row className={moreBtnBarClassName} justify='space-between'>
          <ProFormCheckbox noStyle name='rememberMe' disabled={btnLoading}>
            <FormattedMessage id='pages.login.rememberMe' defaultMessage='记住我' />
          </ProFormCheckbox>

          <NavLink to='/user/register'>
            <FormattedMessage
              key='register'
              id='pages.login.registerAccount'
              defaultMessage='注册账号'
            />
          </NavLink>
        </Row>
      </>
    </LoginForm>
  )
}

export default Login
