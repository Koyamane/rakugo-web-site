/*
 * @Author: dingyun
 * @Date: 2023-03-28 19:32:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 15:09:43
 * @Description:
 */
import IconText from '@/components/IconText'
import useParamsRedirect from '@/hooks/useParamsRedirect'
import { LikeFilled, MessageFilled, StarFilled } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { App, Badge, Button, Space, Tooltip } from 'antd'
import React, { useState } from 'react'
import { ArticleOperationBtnProps, OperationItem, OperationRes } from '../data'
import { BlogCollectApi, BlogLikeApi } from '../services'

const ArticleOperationBtn: React.FC<ArticleOperationBtnProps> = React.memo(
  ({ mobileMode, blogInfo, userId }) => {
    const intl = useIntl()
    const { message } = App.useApp()
    const paramsRedirect = useParamsRedirect()
    const [loading, setLoading] = useState(false)
    const [blogData, setBlogData] = useState<API.BlogDataItem>({
      ...blogInfo.blogDataArr[0]
    })

    const footerBlogDataClassName = useEmotionCss(({ token }) => {
      return {
        fontSize: token.fontSizeLG,
        color: token.colorTextDescription,

        a: {
          color: token.colorTextDescription
        },

        span: {
          marginInlineStart: token.marginXXS
        },

        '.footer-blog-data-item': {
          cursor: 'pointer',
          '&-active': {
            color: token.colorPrimary
          }
        }
      }
    })

    const isIncludeMe = (type: OperationItem['key']) => {
      if (!userId) return false
      if (!blogData) return false

      let flag = false
      switch (type) {
        case 'LIKE':
          flag = blogData.likeArr.includes(userId)
          break
        case 'COLLECT':
          flag = blogData.collectionArr.includes(userId)
          break
        default:
          break
      }
      return flag
    }

    const operationList: OperationItem[] = [
      {
        key: 'LIKE',
        icon: LikeFilled,
        text: blogData.likeArr.length,
        hint: intl.formatMessage({
          id: 'pages.blog.like',
          defaultMessage: '赞'
        })
      },
      {
        key: 'COLLECT',
        icon: StarFilled,
        text: blogData.collectionArr.length,
        hint: intl.formatMessage({
          id: 'pages.blog.collect',
          defaultMessage: '收藏'
        })
      }
    ]

    const handleLike = async (type: 'LIKE') => {
      try {
        const res: OperationRes = await BlogLikeApi(blogInfo.id, type, userId)
        switch (res.status) {
          case 'LIKE':
            setBlogData({
              ...blogData,
              likeArr: res.arr
            })
            break
          case 'CANCEL_LIKE':
            message.success(
              intl.formatMessage({
                id: 'pages.form.canceled',
                defaultMessage: '已取消'
              })
            )
            setBlogData({
              ...blogData,
              likeArr: res.arr
            })
            break
          default:
            break
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleCollect = async () => {
      try {
        const res: OperationRes = await BlogCollectApi(blogInfo.id, userId)
        switch (res.status) {
          case 'COLLECT':
            setBlogData({
              ...blogData,
              collectionArr: res.arr
            })
            break
          case 'CANCEL_COLLECT':
            message.success(
              intl.formatMessage({
                id: 'pages.form.canceled',
                defaultMessage: '已取消'
              })
            )
            setBlogData({
              ...blogData,
              collectionArr: res.arr
            })
            break
          default:
            break
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleClick = async (type: OperationItem['key']) => {
      if (loading) return

      if (!userId) {
        paramsRedirect()
        return
      }

      setLoading(true)

      if (type === 'LIKE') {
        await handleLike(type)
      }

      if (type === 'COLLECT') {
        await handleCollect()
      }

      setLoading(false)
    }

    return mobileMode ? (
      <Space className={footerBlogDataClassName}>
        {operationList.map(item => (
          <Tooltip title={item.hint} key={item.key}>
            <IconText
              icon={item.icon}
              text={item.text}
              onClick={() => handleClick(item.key)}
              className={`footer-blog-data-item ${
                isIncludeMe(item.key) ? 'footer-blog-data-item-active' : ''
              }`}
            />
          </Tooltip>
        ))}

        <Tooltip title={intl.formatMessage({ id: 'pages.blog.comments' })}>
          <a href='#comments'>
            <IconText icon={MessageFilled} text={blogInfo.comments} />
          </a>
        </Tooltip>
      </Space>
    ) : (
      <>
        {operationList.map(item => (
          <Tooltip title={item.hint} key={item.key}>
            <Badge count={item.text}>
              <Button
                size='large'
                shape='circle'
                icon={<item.icon />}
                onClick={() => handleClick(item.key)}
                type={isIncludeMe(item.key) ? 'primary' : 'default'}
              />
            </Badge>
          </Tooltip>
        ))}

        <Tooltip title={intl.formatMessage({ id: 'pages.blog.comments' })}>
          <a href='#comments'>
            <Badge count={blogInfo.comments}>
              <Button shape='circle' size='large' icon={<MessageFilled />} />
            </Badge>
          </a>
        </Tooltip>
      </>
    )
  }
)

export default ArticleOperationBtn
