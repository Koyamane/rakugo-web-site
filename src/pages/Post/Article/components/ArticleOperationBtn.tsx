/*
 * @Author: dingyun
 * @Date: 2023-03-28 19:32:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-10 11:12:34
 * @Description:
 */
import IconText from '@/components/IconText'
import { useGlobalHooks, useParamsRedirect } from '@/hooks'
import { LikeFilled, MessageFilled, StarFilled } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { App, Badge, Button, Space } from 'antd'
import React, { useState } from 'react'
import { ArticleOperationBtnProps, OperationItem, OperationRes } from '../data'
import { BlogCollectApi, BlogLikeApi } from '../services'

const ArticleOperationBtn: React.FC<ArticleOperationBtnProps> = React.memo(
  ({ mobileMode, blogInfo, userId }) => {
    const intl = useIntl()
    const { message } = App.useApp()
    const { isIncludeMe } = useGlobalHooks()
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
            color: token.colorPrimaryText
          }
        }
      }
    })

    const operationList: OperationItem[] = [
      {
        key: 'LIKE',
        icon: LikeFilled,
        text: blogData.likeArr.length
      },
      {
        key: 'COLLECT',
        icon: StarFilled,
        text: blogData.collectionArr.length
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

    const scrollToComments = () => {
      const node = document.getElementById('comments')
      window.scrollTo({ behavior: 'smooth', top: node?.offsetTop })
    }

    return mobileMode ? (
      <Space className={footerBlogDataClassName}>
        {operationList.map(item => (
          <IconText
            key={item.key}
            icon={item.icon}
            text={item.text}
            onClick={() => handleClick(item.key)}
            className={`footer-blog-data-item ${
              isIncludeMe(item.key, [blogData], userId) ? 'footer-blog-data-item-active' : ''
            }`}
          />
        ))}

        <IconText
          icon={MessageFilled}
          text={blogInfo.comments}
          className='footer-blog-data-item'
          onClick={scrollToComments}
        />
      </Space>
    ) : (
      <>
        {operationList.map(item => (
          <Badge count={item.text} key={item.key}>
            <Button
              size='large'
              shape='circle'
              icon={<item.icon />}
              onClick={() => handleClick(item.key)}
              type={isIncludeMe(item.key, [blogData], userId) ? 'primary' : 'default'}
            />
          </Badge>
        ))}

        <Badge count={blogInfo.comments}>
          <Button shape='circle' size='large' onClick={scrollToComments} icon={<MessageFilled />} />
        </Badge>

        {/* <ReportBtn /> */}
      </>
    )
  }
)

export default ArticleOperationBtn
