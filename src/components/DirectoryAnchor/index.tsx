/*
 * @Author: dingyun
 * @Date: 2023-04-14 21:04:56
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 23:05:09
 * @Description:
 */
import { useToken } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Affix, AffixProps, Anchor, Divider } from 'antd'
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor'
import classNames from 'classnames'
import React from 'react'

interface DirectoryAnchorProps {
  items?: AnchorLinkItemProps[]
}

const DirectoryAnchor: React.FC<DirectoryAnchorProps & AffixProps> = React.memo(
  ({ className, items, ...resetProps }) => {
    const { token } = useToken()

    const anchorClassName = useEmotionCss(({ token }) => {
      return {
        padding: token.paddingMD,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,

        '.directory-anchor-title': {
          fontSize: token.fontSizeLG
        },

        '.ant-divider': {
          marginBlock: token.padding
        },

        '.ant-anchor-wrapper .ant-anchor': {
          // 这里用缩略符反而会导致权重不够
          '.ant-anchor-link': {
            margin: '0',
            paddingBlock: '0',

            '.ant-anchor-link-title': {
              padding: token.paddingXS,
              marginBlock: token.marginXXS,
              borderRadius: token.borderRadius,
              '&:hover': {
                background: token.colorPrimaryHover
              }
            }
          }
        }
      }
    })

    return (
      <Affix offsetTop={token.marginMD} {...resetProps}>
        <div className={classNames(anchorClassName, className)}>
          <div className='directory-anchor-title'>
            <FormattedMessage id='component.DirectoryAnchor.directory' />
          </div>
          <Divider />
          <Anchor items={items} affix={false} />
        </div>
      </Affix>
    )
  }
)

export default DirectoryAnchor
