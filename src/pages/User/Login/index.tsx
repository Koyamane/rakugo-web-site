import { useGoRedirect } from '@/hooks'
import { aesEncrypt } from '@/utils/encryption'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, NavLink, useIntl, useModel } from '@umijs/max'
import { App, Col, Form, Row } from 'antd'
import React, { useRef, useState } from 'react'
import Captcha from 'react-captcha-code'
import { LoginParams } from '../data'
import { LoginApi } from '../services'

const Login: React.FC = () => {
  const intl = useIntl()
  const captchaRef = useRef<any>()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const goRedirect = useGoRedirect()
  const [captcha, setCaptcha] = useState('')
  const [btnLoading, setBtnLoading] = useState(false)
  const { setInitialState } = useModel('@@initialState')

  const moreBtnBarClassName = useEmotionCss(({ token }) => {
    return {
      marginBlockEnd: token.marginLG
    }
  })

  const handleSubmit = async (formData: LoginParams) => {
    if (formData.captcha !== captcha) {
      message.error(intl.formatMessage({ id: 'pages.register.captcha.errorMessage' }))
      form.resetFields(['captcha'])
      form.setFields([
        {
          name: ['captcha'],
          validating: true,
          errors: [
            (<FormattedMessage key='captcha' id='pages.register.captcha.errorMessage' />) as any
          ]
        }
      ])
      captchaRef.current.refresh()
      return
    }

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
      setBtnLoading(false)
      form.resetFields(['captcha'])
      captchaRef.current.refresh()
    }
  }

  return (
    <LoginForm
      form={form}
      loading={btnLoading}
      onFinish={handleSubmit}
      logo={<img alt='logo' src='/logo.svg' />}
      title={intl.formatMessage({ id: 'pages.layouts.site.title' })}
      subTitle={intl.formatMessage({ id: 'pages.layouts.site.description' })}
    >
      <>
        <ProFormText
          name='username'
          disabled={btnLoading}
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />
          }}
          placeholder={intl.formatMessage({ id: 'pages.login.username' })}
          rules={[
            {
              required: true,
              message: <FormattedMessage id='pages.register.username.noValue' />
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
          placeholder={intl.formatMessage({ id: 'pages.login.password' })}
          rules={[
            {
              required: true,
              message: <FormattedMessage id='pages.register.password.noValue' />
            }
          ]}
        />

        <Row gutter={24} justify='space-between'>
          <Col span={15}>
            <ProFormText
              name='captcha'
              disabled={btnLoading}
              fieldProps={{ size: 'large' }}
              placeholder={intl.formatMessage({
                id: 'pages.register.captcha',
                defaultMessage: '验证码'
              })}
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id='pages.register.captcha.noValue' />
                }
              ]}
            />
          </Col>

          <Col span={9}>
            <Captcha ref={captchaRef} charNum={4} onChange={setCaptcha} />
          </Col>
        </Row>

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
