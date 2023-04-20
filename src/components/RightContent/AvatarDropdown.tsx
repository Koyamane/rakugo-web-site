import { useParamsRedirect } from '@/hooks'
import { LogOutApi } from '@/services/global'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { history, useIntl, useModel } from '@umijs/max'
import { App, Avatar } from 'antd'
import type { MenuInfo } from 'rc-menu/lib/interface'
import React, { useCallback } from 'react'
import { flushSync } from 'react-dom'
import HeaderDropdown from '../HeaderDropdown'

export type GlobalHeaderRightProps = {
  menu?: boolean
  children?: React.ReactNode
}

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  return <>{currentUser?.nickname}</>
}

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const paramsRedirect = useParamsRedirect()
  const intl = useIntl()
  const { message } = App.useApp()
  const goLogin = () => paramsRedirect({ isNotHint: true })
  const { initialState, setInitialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    try {
      await LogOutApi()
      message.success(
        intl.formatMessage({
          id: 'pages.account.logOut.success',
          defaultMessage: '退出登录成功！'
        })
      )
      goLogin()
      // 如果当前页是仅登录可查的话，会有闪烁，加异步1s也没用
      localStorage.clear()
    } catch (error) {
      console.log(error)
    }
  }

  const avatarClassName = useEmotionCss(({ token }) => {
    return {
      padding: token.paddingXXS,
      display: 'inline-flex',
      marginInlineEnd: token.marginXXS,
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.controlItemBgHover
      }
    }
  })

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event
      if (key === 'logout') {
        flushSync(() => {
          setInitialState(s => ({ ...s, currentUser: undefined }))
        })
        loginOut()
        return
      }

      if (key === 'center') {
        history.push(`/account/center/${currentUser?.userId}`)
        return
      }

      history.push(`/account/${key}`)
    },
    [currentUser]
  )

  const notLogin = (
    <span className={avatarClassName}>
      <Avatar size='small' alt='avatar' onClick={goLogin} icon={<UserOutlined />} />
    </span>
  )

  if (!initialState) {
    return notLogin
  }

  if (!currentUser || !currentUser.username) {
    return notLogin
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: intl.formatMessage({
              id: 'pages.account.center',
              defaultMessage: '个人中心'
            })
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: intl.formatMessage({
              id: 'pages.account.settings',
              defaultMessage: '个人设置'
            })
          },
          {
            type: 'divider' as const
          }
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: intl.formatMessage({
        id: 'pages.account.logOut',
        defaultMessage: '退出登录'
      })
    }
  ]

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems
      }}
    >
      {children}
    </HeaderDropdown>
  )
}
