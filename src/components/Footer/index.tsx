/*
 * @Author: dingyun
 * @Date: 2023-04-18 19:48:24
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-25 12:34:19
 * @Description:
 */
import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import React from 'react'

const Footer: React.FC = () => {
  const containerClassName = useEmotionCss(({ token }) => ({
    '& .ant-pro-global-footer': {
      marginBlock: token.marginLG
    },
    '& .ant-pro-global-footer-copyright': {
      a: {
        color: token.colorText,
        marginInlineStart: token.marginMD
      }
    },
    a: {
      '&:hover': {
        color: token.colorText,
        textDecoration: 'underline'
      }
    }
  }))

  return (
    <DefaultFooter
      style={{
        background: 'transparent'
      }}
      className={containerClassName}
      copyright={
        <>
          2023 <FormattedMessage id='app.copyright.produced' />
          <a target='_blank' href='https://beian.miit.gov.cn/' rel='noopener noreferrer'>
            赣ICP备2021009462号-1
          </a>
        </>
      }
      links={[
        {
          key: '小山音的Github主页',
          title: 'Koyamane',
          href: 'https://github.com/Koyamane',
          blankTarget: true
        },
        {
          key: '落語项目地址',
          title: <GithubOutlined />,
          href: 'https://github.com/Koyamane/rakugo-web-site',
          blankTarget: true
        },
        {
          key: '小山音ゴゴ的哔哩哔哩主页',
          title: 'bilibili',
          href: 'https://space.bilibili.com/21244622',
          blankTarget: true
        }
      ]}
    />
  )
}

export default Footer
