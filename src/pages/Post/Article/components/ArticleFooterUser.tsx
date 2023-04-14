/*
 * @Author: dingyun
 * @Date: 2023-03-28 19:32:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 15:42:07
 * @Description:
 */
import { FollowButton } from '@/components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { NavLink, useModel } from '@umijs/max'
import { Avatar } from 'antd'
import React from 'react'

interface PropsType {
  blogInfo: API.BlogInfo
}

const ArticleFooterUser: React.FC<PropsType> = React.memo(({ blogInfo }) => {
  const { followed, setFollowed } = useModel('useArticle')
  const footerUserDataClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      alignItems: 'center',

      '.footer-user-data-center': {
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        marginInlineStart: token.marginSM,

        span: {
          fontSize: token.fontSizeSM,
          color: token.colorTextDescription
        }
      },

      '.footer-user-data-follow': {
        marginInlineStart: token.marginSM
      }
    }
  })

  return (
    <div className={footerUserDataClassName}>
      <NavLink target='_blank' to={`/account/center/${blogInfo.createdId}`}>
        <Avatar src={blogInfo.createdAvatar} />
      </NavLink>

      <div className='footer-user-data-center'>
        <NavLink target='_blank' to={`/account/center/${blogInfo.createdId}`}>
          {blogInfo.createdName}
        </NavLink>
        <span className='text-ellipsis'>{blogInfo.createdSignature}</span>
      </div>

      <FollowButton
        notInit
        mobileMode
        followedValue={followed}
        onFollowChange={setFollowed}
        targetId={blogInfo.createdId}
        className='footer-user-data-follow'
      />
    </div>
  )
})

export default ArticleFooterUser
