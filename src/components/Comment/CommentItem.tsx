/*
 * @Author: dingyun
 * @Date: 2023-04-15 12:01:42
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-15 17:23:32
 * @Description:
 */
import { useFormatTime, useParamsRedirect } from '@/hooks'
import { OperationRes } from '@/pages/Post/Article/data'
import { ExclamationCircleOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { NavLink, useIntl, useModel } from '@umijs/max'
import { App, Avatar, Modal, Space } from 'antd'
import React, { useMemo, useState } from 'react'
import { CommentItemProps } from './data'
import { CommentDeleteApi, CommentLikeApi } from './services'

const CommentItem: React.FC<CommentItemProps> = React.memo(props => {
  const { commentInfo, children } = props
  const formatTime = useFormatTime(false, 7)
  const intl = useIntl()
  const paramsRedirect = useParamsRedirect()
  const { message } = App.useApp()
  const [modal, contextHolder] = Modal.useModal()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const { initialState } = useModel('@@initialState')
  const { likeObj, setLikeObj, commenting, setCurrentComment, deleteLikeObjSomeone } =
    useModel('useComment')
  const currentUser = initialState?.currentUser
  const isMe = useMemo(() => {
    return currentUser?.userId === commentInfo.userId
  }, [currentUser?.userId, commentInfo.userId])
  const likeInfo = useMemo(() => {
    return likeObj[commentInfo.id]
  }, [likeObj[commentInfo.id]])

  const CommentItemClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      paddingBlock: token.paddingMD,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,

      '.comment-component-item': {
        '&-avatar': {
          flexShrink: '0'
        },

        '&-right': {
          flex: '1',
          color: token.colorTextDescription,
          marginInlineStart: token.marginSM,

          '&-name': {
            a: {
              color: token.colorTextDescription,
              '&:hover': {
                color: token.colorPrimaryTextHover
              }
            }
          },

          '&-content': {
            color: token.colorText,
            marginBlock: token.marginXXS
          },

          '&-reply': {
            color: token.colorText,
            marginInline: token.marginXS
          },

          '&-actions': {
            display: 'flex',
            fontSize: token.fontSizeSM,
            justifyContent: 'space-between',

            '&-btn': {
              cursor: 'pointer',
              '&:hover': {
                color: token.colorPrimaryTextHover
              }
            },

            '&-left': {
              fontSize: token.fontSizeSM,
              '&-like': {
                cursor: 'pointer'
              },
              '&-active': {
                color: token.colorPrimaryText
              }
            }
          },

          '&-children .comment-component-item': {
            border: 'none',
            paddingBlockEnd: '0'
          }
        }
      }
    }
  })

  const handleDelete = async () => {
    if (deleteLoading) return

    modal.confirm({
      title: intl.formatMessage({ id: 'pages.form.delete.title' }),
      okType: 'danger',
      content: commentInfo.comment,
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        setDeleteLoading(true)
        try {
          await CommentDeleteApi({
            id: commentInfo.id,
            targetId: commentInfo.targetId,
            isChildren: !!commentInfo.parentId
          })
          deleteLikeObjSomeone(commentInfo.id)
        } catch (error) {
          console.log('删除报错了')
        }
        setDeleteLoading(false)
      }
    })
  }

  const handleLike = async () => {
    if (!currentUser?.userId) {
      paramsRedirect()
      return
    }

    if (likeLoading) return

    setLikeLoading(true)

    try {
      const res: OperationRes = await CommentLikeApi({
        id: commentInfo.id,
        type: 'LIKE',
        userId: currentUser.userId,
        isChildren: !!commentInfo.parentId
      })
      let obj = likeObj[commentInfo.id]

      switch (res.status) {
        case 'LIKE':
          obj = {
            ...obj,
            likes: res.arr.length,
            liked: true
          }
          break
        case 'CANCEL_LIKE':
          message.success(intl.formatMessage({ id: 'pages.form.canceled' }))
          obj = {
            ...obj,
            likes: res.arr.length,
            liked: false
          }
          break
        default:
          break
      }

      setLikeObj({ [commentInfo.id]: obj }, true)
    } catch (error) {
      console.log(error)
    }
    setLikeLoading(false)
  }

  const handleReplyTo = async () => {
    if (commenting) return
    setCurrentComment(commentInfo)
  }

  return (
    <div className={CommentItemClassName + ' comment-component-item'}>
      {contextHolder}

      <NavLink
        target='_blank'
        to={`/account/center/${commentInfo.userId}`}
        className='comment-component-item-avatar'
      >
        <Avatar src={commentInfo.userAvatar} />
      </NavLink>

      <div className='comment-component-item-right'>
        <div className='comment-component-item-right-name'>
          <NavLink target='_blank' to={`/account/center/${commentInfo.userId}`}>
            {commentInfo.username}
          </NavLink>
          {commentInfo.level > 2 && (
            <>
              <span className='comment-component-item-right-reply'>
                {intl.formatMessage({ id: 'pages.blog.replyTo' })}
              </span>
              <NavLink to={`/account/center/${commentInfo.replyId}`}>
                @{commentInfo.replyName}
              </NavLink>
            </>
          )}
        </div>

        <div className='comment-component-item-right-content'>{commentInfo.comment}</div>

        <div className='comment-component-item-right-actions'>
          <Space size='middle' className='comment-component-item-right-actions-left'>
            <span>{formatTime(commentInfo.createdDate)}</span>
            <span
              onClick={handleLike}
              className={`comment-component-item-right-actions-left-like ${
                likeInfo.liked && 'comment-component-item-right-actions-left-active'
              }`}
            >
              {likeInfo.liked ? <LikeFilled /> : <LikeOutlined />}
              &ensp;
              {likeInfo.likes}
            </span>
            <span onClick={handleReplyTo} className='comment-component-item-right-actions-btn'>
              {intl.formatMessage({ id: 'pages.blog.replyTo' })}
            </span>
          </Space>

          {isMe && (
            <span className='comment-component-item-right-actions-btn' onClick={handleDelete}>
              {intl.formatMessage({ id: 'pages.form.delete' })}
            </span>
          )}
        </div>

        {children && <div className='comment-component-item-right-children'>{children}</div>}
      </div>
    </div>
  )
})

export default CommentItem
