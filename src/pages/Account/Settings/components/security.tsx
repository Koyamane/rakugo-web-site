/*
 * @Author: dingyun
 * @Date: 2022-01-01 19:15:55
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2022-01-01 19:26:53
 * @Description:
 */
import { FormattedMessage, useIntl } from '@umijs/max'
import { List } from 'antd'
import React from 'react'
import ModifyPassword from './ModifyPassword'

type Unpacked<T> = T extends (infer U)[] ? U : T

const passwordStrength = {
  strong: (
    <span className='strong'>
      <FormattedMessage id='pages.account.security.strong' defaultMessage='强' />
    </span>
  ),
  medium: (
    <span className='medium'>
      <FormattedMessage id='pages.account.security.medium' defaultMessage='中' />
    </span>
  ),
  weak: (
    <span className='weak'>
      <FormattedMessage id='pages.account.security.weak' defaultMessage='弱' />
    </span>
  )
}

const SecurityView: React.FC = () => {
  const intl = useIntl()

  const data = [
    {
      title: intl.formatMessage({
        id: 'pages.account.security.password',
        defaultMessage: '账户密码'
      }),
      description: (
        <>
          {intl.formatMessage({
            id: 'pages.account.security.password-description',
            defaultMessage: '当前密码强度：'
          })}
          {passwordStrength.strong}
        </>
      ),
      actions: [<ModifyPassword key='modify-password' />]
    }
    // {
    //   title: '密保手机',
    //   description: `已绑定手机：138****8293`,
    //   actions: [<a key="Modify">修改</a>],
    // },
    // {
    //   title: '密保问题',
    //   description: '未设置密保问题，密保问题可有效保护账户安全',
    //   actions: [<a key="Set">设置</a>],
    // },
    // {
    //   title: '备用邮箱',
    //   description: `已绑定邮箱：ant***sign.com`,
    //   actions: [<a key="Modify">修改</a>],
    // },
  ]

  return (
    <List<Unpacked<typeof data>>
      itemLayout='horizontal'
      dataSource={data}
      renderItem={item => (
        <List.Item actions={item.actions}>
          <List.Item.Meta title={item.title} description={item.description} />
        </List.Item>
      )}
    />
  )
}

export default SecurityView
