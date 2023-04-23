/*
 * @Author: dingyun
 * @Date: 2023-04-12 15:26:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-23 17:19:53
 * @Description:
 */
import loginBg from '@/assets/login-bg.jpg'
import { SelectLang } from '@/components'
import Footer from '@/components/Footer'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Helmet, Outlet, useIntl, useLocation } from '@umijs/max'
import React, { useMemo } from 'react'
import Settings from '../../../config/defaultSettings'

const Lang = () => {
  const langBoxClassName = useEmotionCss(({ token }) => {
    return {
      paddingInlineEnd: token.marginXL,
      paddingBlockStart: token.marginMD,
      textAlign: 'right'
    }
  })

  const langClassName = useEmotionCss(({ token }) => {
    return {
      display: 'inline-block',
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover
      }
    }
  })

  return (
    <div className={langBoxClassName} data-lang>
      {SelectLang && (
        <div className={langClassName}>
          <SelectLang />
        </div>
      )}
    </div>
  )
}

const User: React.FC = () => {
  const intl = useIntl()
  const location = useLocation()

  const pageTitle = useMemo(() => {
    let strId = 'menu.login'

    switch (location.pathname) {
      case '/user/register':
        strId = 'menu.register'
        break
      case '/user/register/result':
        strId = 'menu.register-result'
        break
      default:
        strId = 'menu.login'
        break
    }

    return `${intl.formatMessage({ id: strId })}- ${Settings.title}`
  }, [intl.locale, location.pathname])

  const containerClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: `url(${loginBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      '& .ant-pro-form-login-container': {
        background: 'initial',
        alignItems: 'center',
        padding: 0,
        paddingBlockStart: token.paddingXL
      },
      '& .ant-pro-form-login-title': {
        color: token.colorPrimaryText
      },
      '& .ant-pro-form-login-logo img': {
        transform: `translateY(${token.marginSM}px)`
      },
      '& .ant-pro-form-login-main': {
        padding: token.paddingMD,
        background: '#f5f5f5cc',
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadow
      },
      '& .react-captcha': {
        borderRadius: token.borderRadius
      }
    }
  })

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <Lang />

      <Outlet />

      <Footer />
    </div>
  )
}

export default User
