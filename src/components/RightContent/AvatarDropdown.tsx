// import { outLogin } from '@/services/ant-design-pro/api';
import { useParamsRedirect } from '@/hooks'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { history, useModel } from '@umijs/max'
import { Avatar } from 'antd'
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
  return <span className='anticon'>{currentUser?.name}</span>
}

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const paramsRedirect = useParamsRedirect()
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    // await outLogin();
    paramsRedirect({ isNotHint: true })
  }
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      '&:hover': {
        backgroundColor: token.colorBgTextHover
      }
    }
  })
  const { initialState, setInitialState } = useModel('@@initialState')

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
      history.push(`/account/${key}`)
    },
    [setInitialState]
  )

  const goLogin = () => paramsRedirect()

  const notLogin = (
    <Avatar
      size='small'
      onClick={goLogin}
      className={actionClassName}
      icon={<UserOutlined />}
      alt='avatar'
    />
  )

  if (!initialState) {
    return notLogin
  }

  const { currentUser } = initialState

  if (!currentUser || !currentUser.username) {
    return notLogin
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心'
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置'
          },
          {
            type: 'divider' as const
          }
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
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
