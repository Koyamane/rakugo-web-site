import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import React from 'react'

const Footer: React.FC = () => {
  const intl = useIntl()
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '小山音出品'
  })

  const containerClassName = useEmotionCss(({ token }) => {
    return {
      '& .ant-pro-global-footer': {
        marginBlock: token.marginLG
      },
      '& .ant-pro-global-footer-list *:hover': {
        color: token.colorText
      }
    }
  })

  return (
    <DefaultFooter
      style={{
        background: 'none'
      }}
      className={containerClassName}
      copyright={`2023 ${defaultMessage}`}
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
          href: 'https://github.com/Koyamane/blog-web-site',
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
