/*
 * @Author: dingyun
 * @Date: 2023-04-12 15:26:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-25 21:51:25
 * @Description:
 */
import loginBg from '@/assets/humikiri.jpg'
import { SelectLang } from '@/components'
import Footer from '@/components/Footer'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Helmet, Outlet, useIntl, useLocation } from '@umijs/max'
import React, { useEffect, useState } from 'react'

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
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover
      }
    }
  })

  return (
    <div className={langBoxClassName} data-lang>
      {SelectLang && <SelectLang className={langClassName} />}
    </div>
  )
}

const User: React.FC = () => {
  const intl = useIntl()
  const location = useLocation()
  const [pageTitle, setPageTitle] = useState('')

  useEffect(() => {
    // 千万不要用 useMemo 来赋值，不然登录完成跳转后，页面标题依旧为“登录”
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

    setPageTitle(
      `${intl.formatMessage({ id: strId })} - ${intl.formatMessage({
        id: 'pages.layouts.site.title'
      })}`
    )
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
