/*
 * @Author: dingyun
 * @Date: 2023-04-08 21:55:34
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-09 21:08:24
 * @Description:
 */
import { useToken } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Menu } from 'antd'
import React, { useLayoutEffect, useState } from 'react'
import BaseView from './components/base'
import SecurityView from './components/security'

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification'
type SettingsState = {
  mode: 'inline' | 'horizontal'
  selectKey: SettingsStateKeys
}

const Settings: React.FC = () => {
  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base'
  })
  const { token } = useToken()

  const resize = () => {
    requestAnimationFrame(() => {
      let mode: 'inline' | 'horizontal' = 'inline'
      if (window.innerWidth < token.screenMD) {
        mode = 'horizontal'
      }
      setInitConfig({ ...initConfig, mode: mode as SettingsState['mode'] })
    })
  }

  const renderChildren = () => {
    const { selectKey } = initConfig
    switch (selectKey) {
      case 'base':
        return <BaseView />
      case 'security':
        return <SecurityView />
      default:
        return null
    }
  }

  const menuItems = [
    {
      label: <FormattedMessage id='pages.account.menuMap.basic' defaultMessage='基本设置' />,
      key: 'base'
    },
    {
      label: <FormattedMessage id='pages.account.menuMap.security' defaultMessage='安全设置' />,
      key: 'security'
    }
  ]

  const getMenuKey = (selectKey: string) => {
    const menuItem = menuItems.find(item => item.key === selectKey)
    return menuItem?.label
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', resize)
    resize()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const settingsClassName = useEmotionCss(({ token }) => ({
    display: 'flex',
    overflow: 'hidden',
    color: token.colorText,

    '.account-settings': {
      '&-left': {
        overflow: 'hidden',
        minWidth: '220px',
        padding: token.paddingXXS,
        marginInlineEnd: token.marginMD,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,

        '.ant-menu': {
          borderInlineEnd: 'none'
        }
      },

      '&-right': {
        flex: 1,
        paddingInline: token.paddingMD,
        borderRadius: token.borderRadius,
        paddingBlockStart: token.paddingMD,
        background: token.colorBgContainer,

        '&-title': {
          paddingBlockEnd: token.paddingXS,
          color: token.colorTextHeading,
          fontSize: token.fontSizeHeading4,
          fontWeight: token.fontWeightStrong
        }
      }
    },

    '.ant-list .ant-list-item .ant-list-item-meta .ant-list-item-meta-title': {
      marginBlockStart: '0'
    },

    [`@media screen and (max-width: ${token.screenMD}px)`]: {
      '&.account-settings': {
        flexDirection: 'column'
      },
      '.account-settings-left': {
        width: '100%',
        padding: '0',
        marginInlineEnd: '0',
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0'
      },
      '.account-settings-right': {
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0'
      }
    }
  }))

  return (
    <div className={settingsClassName + ' account-settings'}>
      <div className='account-settings-left'>
        <Menu
          items={menuItems}
          mode={initConfig.mode}
          selectedKeys={[initConfig.selectKey]}
          onClick={({ key }) => {
            setInitConfig({
              ...initConfig,
              selectKey: key as SettingsStateKeys
            })
          }}
        />
      </div>

      <div className='account-settings-right'>
        <div className='account-settings-right-title'>{getMenuKey(initConfig.selectKey)}</div>
        {renderChildren()}
      </div>
    </div>
  )
}

export default Settings
