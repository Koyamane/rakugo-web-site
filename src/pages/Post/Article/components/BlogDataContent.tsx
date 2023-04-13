/*
 * @Author: dingyun
 * @Date: 2023-03-28 19:32:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-04 20:45:25
 * @Description:
 */
import IconText from '@/components/IconText'
import useParamsRedirect from '@/hooks/useParamsRedirect'
import { DislikeFilled, LikeFilled, StarFilled } from '@ant-design/icons'
import { useIntl } from '@umijs/max'
import { message, Space, Tooltip } from 'antd'
import React, { useState } from 'react'
import { BlogDataContentProps, OperationItem, OperationRes } from '../data'
import styles from '../index.less'
import { BlogCollectApi, BlogLikeApi } from '../services'

const BlogDataContent: React.FC<BlogDataContentProps> = React.memo(({ blogInfo, userId }) => {
  const intl = useIntl()
  const paramsRedirect = useParamsRedirect()
  const [loading, setLoading] = useState(false)
  const [blogData, setBlogData] = useState<API.BlogDataItem>({
    ...blogInfo.blogDataArr[0]
  })

  const isIncludeMe = (type: OperationItem['key']) => {
    if (!userId) return false
    if (!blogData) return false

    let flag = false
    switch (type) {
      case 'LIKE':
        flag = blogData.likeArr.includes(userId)
        break
      case 'DISLIKE':
        flag = blogData.dislikeArr.includes(userId)
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
      key: 'DISLIKE',
      icon: DislikeFilled,
      text: blogData.dislikeArr.length,
      hint: intl.formatMessage({
        id: 'pages.blog.dislike',
        defaultMessage: '踩'
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

  const handleLike = async (type: 'LIKE' | 'DISLIKE') => {
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
        case 'DISLIKE':
          setBlogData({
            ...blogData,
            dislikeArr: res.arr
          })
          break
        case 'CANCEL_DISLIKE':
          message.success(
            intl.formatMessage({
              id: 'pages.form.canceled',
              defaultMessage: '已取消'
            })
          )
          setBlogData({
            ...blogData,
            dislikeArr: res.arr
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

    if (type === 'LIKE' || type === 'DISLIKE') {
      await handleLike(type)
    }

    if (type === 'COLLECT') {
      await handleCollect()
    }

    setLoading(false)
  }

  return (
    <Space className={styles.BlogDataContent}>
      {operationList.map(item => (
        <Tooltip title={item.hint} key={item.key}>
          <IconText
            icon={item.icon}
            text={item.text}
            onClick={() => handleClick(item.key)}
            className={`blog-data-content-item ${
              isIncludeMe(item.key) ? 'blog-data-content-item-active' : ''
            }`}
          />
        </Tooltip>
      ))}
    </Space>
  )
})

export default BlogDataContent
