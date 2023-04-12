import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, Link, useModel } from '@umijs/max'
import { Button, Result } from 'antd'
import React from 'react'

const RegisterResult: React.FC = () => {
  const { initialState } = useModel('@@initialState')
  const btnClassName = useEmotionCss(({ token }) => {
    return {
      marginInlineEnd: token.marginXS
    }
  })

  return (
    <Result
      status='success'
      title={
        <span>
          <FormattedMessage id='pages.register.result.success.prefix' defaultMessage='你的账号：' />
          {initialState?.currentUser?.username}
          <FormattedMessage id='pages.register.result.success.suffix' defaultMessage=' 注册成功' />
        </span>
      }
      subTitle={
        <FormattedMessage
          id='pages.register.result.success.hint'
          defaultMessage='可以尽情地发布内容啦'
        />
      }
      extra={[
        <Link key='home' to='/'>
          <Button className={btnClassName}>
            <FormattedMessage id='pages.home.backHome' defaultMessage='回首页' />
          </Button>
        </Link>,
        <Link key='settings' to='/account/settings'>
          <Button type='primary'>
            <FormattedMessage
              id='pages.register.result.improvePersonalInformation'
              defaultMessage='完善个人信息'
            />
          </Button>
        </Link>
      ]}
    />
  )
}

export default RegisterResult
