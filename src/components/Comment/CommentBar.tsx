/*
 * @Author: dingyun
 * @Date: 2023-03-06 13:41:39
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-15 17:25:33
 * @Description:
 */
import { UserOutlined } from '@ant-design/icons'
import { ProFormTextArea } from '@ant-design/pro-form'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl, useModel } from '@umijs/max'
import { App, Avatar, Button, Form } from 'antd'
import React, { useMemo } from 'react'
import { CommentAddParams, CommentBarProps } from './data'
import { CommentApi } from './services'

const CommentBar: React.FC<CommentBarProps> = React.memo(props => {
  const { targetId, targetType, commentInfo, paramsRedirect, userInfo, setCommentList } = props
  const intl = useIntl()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { commenting, setCommenting } = useModel('useComment')

  const commentPlaceholder = useMemo(() => {
    if (!commentInfo) {
      return intl.formatMessage({ id: 'pages.content.placeholder' })
    }

    const { username } = commentInfo

    if (intl.locale === 'ja-JP') {
      return `@${username} に返事します：`
    }

    const str = intl.formatMessage({
      id: 'pages.blog.replyTo',
      defaultMessage: '回复'
    })

    return `${str} @${username}：`
  }, [intl.locale, commentInfo])

  const handleComment = async () => {
    if (!userInfo?.userId) {
      paramsRedirect()
      return
    }

    const commentValue = form.getFieldValue('comment')

    if (/^(\n|\s)*$/.test(commentValue)) {
      message.info(
        intl.formatMessage({
          id: 'pages.content.empty',
          defaultMessage: '内容不能为空'
        })
      )
      return
    }

    setCommenting(true)

    let params: CommentAddParams = { targetId, comment: commentValue, targetType }

    if (commentInfo) {
      // 说明是回复别人，不是评论整个内容
      params = {
        ...params,
        replyId: commentInfo.userId,
        replyName: commentInfo.username,
        parentId: commentInfo.parentId || commentInfo.id,
        level: commentInfo.parentId ? 3 : 2
      }
    }

    try {
      const res = await CommentApi(params)
      setCommentList(res)
      message.success(
        intl.formatMessage({
          id: 'pages.comment.success',
          defaultMessage: '发布成功'
        })
      )
      form.resetFields()
    } catch (error) {
      console.log(error)
    }
    setCommenting(false)
  }

  const CommentBtnBarClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      marginBlockStart: token.marginMD,

      '.comment-btn-bar-avatar': {
        flexShrink: '0'
      },

      '.ant-form-item': {
        flex: '1',
        marginBlock: '0',
        marginInline: token.marginSM
      },

      button: {
        height: '100%'
      }
    }
  })

  return (
    <Form className={CommentBtnBarClassName} form={form}>
      {userInfo?.avatar ? (
        <Avatar
          src={userInfo?.avatar}
          alt={userInfo?.nickname}
          className='comment-btn-bar-avatar'
        />
      ) : (
        <Avatar className='comment-btn-bar-avatar' icon={<UserOutlined />} />
      )}

      {/* 默认为空，不能删除这个赋值 */}
      <ProFormTextArea
        name='comment'
        initialValue=''
        disabled={commenting}
        fieldProps={{ rows: 2 }}
        placeholder={commentPlaceholder}
      />

      <div>
        <Button type='primary' loading={commenting} onClick={handleComment}>
          {intl.formatMessage({ id: 'pages.comment.add' })}
        </Button>
      </div>
    </Form>
  )
})

export default CommentBar
