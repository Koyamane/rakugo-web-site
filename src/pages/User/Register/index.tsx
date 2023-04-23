import { aesEncrypt } from '@/utils/encryption'
import { LoginForm } from '@ant-design/pro-components'
import { ProFormText } from '@ant-design/pro-form'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, history, NavLink, useIntl, useModel } from '@umijs/max'
import { Col, Form, message, Row } from 'antd'
import { FC, useRef, useState } from 'react'
import Captcha from 'react-captcha-code'
import { RegisterParams } from '../data'
import { RegisterApi } from '../services'

const Register: FC = () => {
  const { setInitialState } = useModel('@@initialState')
  // 这个值是用来刷新页面的，为了让hint立刻更新
  const [checkNow, setCheckNow]: [boolean, any] = useState(true)
  const [btnLoading, setBtnLoading]: [boolean, any] = useState(false)
  const [captcha, setCaptcha] = useState('')
  const intl = useIntl()
  const [form] = Form.useForm()
  const captchaRef = useRef<any>()

  const errorClassName = useEmotionCss(({ token }) => {
    return {
      color: token.colorError,
      transition: 'color 0.3s'
    }
  })
  const successClassName = useEmotionCss(({ token }) => {
    return {
      color: token.colorSuccess,
      transition: 'color 0.3s'
    }
  })
  const warningClassName = useEmotionCss(({ token }) => {
    return {
      color: token.colorWarning,
      transition: 'color 0.3s'
    }
  })

  const passwordHint = () => {
    const value = form.getFieldValue('password')

    if (!value) {
      return undefined
    }

    if (value.length > 16) {
      return (
        <div className={errorClassName}>
          {intl.formatMessage({
            id: 'pages.register.password.tooLong',
            defaultMessage: '密码不能超过16个字符'
          })}
        </div>
      )
    }

    if (value.length > 9) {
      return (
        <div className={successClassName}>
          {intl.formatMessage({
            id: 'pages.register.password.strongSafetyFactor',
            defaultMessage: '安全系数：强'
          })}
        </div>
      )
    }

    if (value.length > 5) {
      return (
        <div className={warningClassName}>
          {intl.formatMessage({
            id: 'pages.register.password.mediumSafetyFactor',
            defaultMessage: '安全系数：中'
          })}
        </div>
      )
    }

    return (
      <div className={errorClassName}>
        {intl.formatMessage({
          id: 'pages.register.password.weakSafetyFactor',
          defaultMessage: '安全系数：弱'
        })}
      </div>
    )
  }

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise
    const password = form.getFieldValue('password')
    if (value && password && value !== password) {
      return promise.reject(
        <FormattedMessage
          id='pages.register.confirmPassword.mismatch'
          defaultMessage='两次输入的密码不匹配'
        />
      )
    }
    return promise.resolve()
  }

  // 校验用户名
  const checkUsername = (_: any, value: string) => {
    setCheckNow(!checkNow)

    const promise = Promise

    // 没有值的情况
    if (!value) {
      return promise.reject(
        <FormattedMessage id='pages.register.username.noValue' defaultMessage='请输入用户名' />
      )
    }

    // 非数字、字母、下划线时
    if (!/^\w+$/.test(value)) {
      return promise.reject(
        <FormattedMessage
          id='pages.register.username.wrongValue'
          defaultMessage='有非数字、字母和下划线的字符'
        />
      )
    }

    if (value.length < 6) {
      return promise.reject(
        <FormattedMessage id='pages.register.username.tooShort' defaultMessage='用户名太短' />
      )
    }

    if (value.length > 16) {
      return promise.reject(
        <FormattedMessage
          id='pages.register.username.tooLong'
          defaultMessage='用户名不能超过16个字符'
        />
      )
    }

    return promise.resolve()
  }

  // 校验密码
  const checkPassword = (_: any, value: string) => {
    setCheckNow(!checkNow)

    if (value && form.getFieldValue('confirm')) {
      // 这里必须异步，因为提交表单的时候会走一边校验，两个一直执行会有冲突
      setTimeout(() => {
        form.validateFields(['confirm'])
      })
    }

    const promise = Promise

    // 没有值的情况
    if (!value) {
      return promise.reject(
        <FormattedMessage id='pages.register.password.noValue' defaultMessage='请输入密码！' />
      )
    }

    if (value.length < 6) {
      return promise.reject(
        <FormattedMessage id='pages.register.password.tooShort' defaultMessage='密码太短' />
      )
    }

    if (value.length > 16) {
      return promise.reject(
        <FormattedMessage
          id='pages.register.password.tooLong'
          defaultMessage='密码不能超过16个字符'
        />
      )
    }

    return promise.resolve()
  }

  const handleRegister = async (formData: RegisterParams) => {
    if (formData.captcha !== captcha) {
      message.error(
        intl.formatMessage({
          id: 'pages.register.captcha.errorMessage',
          defaultMessage: '验证码错误'
        })
      )

      form.setFields([
        {
          name: ['captcha'],
          validating: true,
          errors: [
            (
              <FormattedMessage
                key='captcha'
                id='pages.register.captcha.errorMessage'
                defaultMessage='验证码错误'
              />
            ) as any
          ]
        }
      ])

      captchaRef.current.refresh()
      return
    }

    try {
      setBtnLoading(true)

      const res = await RegisterApi({
        username: formData.username,
        password: aesEncrypt(formData.password)
      })

      localStorage.setItem('token', res.token)
      await setInitialState(s => ({
        ...s,
        currentUser: res.userInfo
      }))

      message.success(
        intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！'
        })
      )

      history.replace('/user/register/result')
    } catch (error) {
      setBtnLoading(false)
    }
  }

  return (
    <LoginForm
      form={form}
      loading={btnLoading}
      logo={<img alt='logo' src='/logo.svg' />}
      title={intl.formatMessage({ id: 'pages.layouts.site.title' })}
      subTitle={intl.formatMessage({ id: 'pages.layouts.site.description' })}
      onFinish={handleRegister}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: 'pages.login.register',
            defaultMessage: '注册'
          })
        }
      }}
      actions={
        <div style={{ textAlign: 'end' }}>
          <NavLink key='goLogin' to='/user/login'>
            {intl.formatMessage({
              id: 'pages.login.goLogin',
              defaultMessage: '使用已有账号登录'
            })}
          </NavLink>
        </div>
      }
    >
      <ProFormText
        name='username'
        disabled={btnLoading}
        fieldProps={{ size: 'large' }}
        placeholder={intl.formatMessage({
          id: 'pages.register.username',
          defaultMessage: '用户名（仅限数字、字母和下划线）'
        })}
        rules={[{ validator: checkUsername }]}
      />

      <ProFormText.Password
        name='password'
        disabled={btnLoading}
        help={passwordHint()}
        fieldProps={{ size: 'large' }}
        placeholder={intl.formatMessage({
          id: 'pages.register.password',
          defaultMessage: '密码（6~16位字符，区分大小写）'
        })}
        rules={[{ validator: checkPassword }]}
      />

      <ProFormText.Password
        name='confirm'
        disabled={btnLoading}
        fieldProps={{ size: 'large' }}
        placeholder={intl.formatMessage({
          id: 'pages.register.confirmPassword',
          defaultMessage: '确认密码'
        })}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id='pages.register.confirmPassword.noValue'
                defaultMessage='请输入确认密码！'
              />
            )
          },
          { validator: checkConfirm }
        ]}
      />

      <Row gutter={8} justify='space-between'>
        <Col span={16}>
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
                message: (
                  <FormattedMessage
                    id='pages.register.captcha.noValue'
                    defaultMessage='请输入验证码！'
                  />
                )
              }
            ]}
          />
        </Col>

        <Col span={8}>
          <Captcha ref={captchaRef} charNum={4} onChange={setCaptcha} />
        </Col>
      </Row>
    </LoginForm>
  )
}
export default Register
