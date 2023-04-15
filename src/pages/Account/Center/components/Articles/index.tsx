import BlogListSkeleton from '@/components/BlogListSkeleton'
import IconText from '@/components/IconText'
import useFormatTime from '@/hooks/useFormatTime'
import usePaginationItem from '@/hooks/usePaginationItem'
import { BLOG_STATUS, toObj } from '@/locales/dataDictionary'
import { OperationItem } from '@/pages/Post/Article/data'
import {
  DislikeFilled,
  DislikeOutlined,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  StarFilled,
  StarOutlined,
  StockOutlined
} from '@ant-design/icons'
import { connect, Dispatch, history, useIntl } from '@umijs/max'
import { App, List, Popover, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteBlogApi, SomebodyBlogPage } from '../../service'
import BlogTitle from './BlogTitle'
import styles from './index.less'

interface SelfProps {
  dispatch: Dispatch
  isMe?: boolean
  loginUserId?: API.UserInfo['userId']
  userId?: API.UserInfo['userId']
}

const Articles: React.FC<SelfProps> = ({ isMe, loginUserId, userId, dispatch }) => {
  const intl = useIntl()
  const [listLoading, setBistLoading] = useState(true)
  const [firstEnter, setFirstEnter] = useState(true)
  const formatTime = useFormatTime()
  const { message } = App.useApp()
  const itemRender = usePaginationItem()
  const [blogData, setBlogData] = useState<{
    list: API.BlogInfo[]
    pagination: { current: number; total: number }
  }>({
    list: [],
    pagination: { current: 1, total: 0 }
  })

  const getBlogList = async (current: number = blogData.pagination.current) => {
    setBistLoading(true)
    try {
      const params = {
        dto: {},
        current
      }

      if (!isMe) {
        // 不是自己的页面，只能看审核通过的东西
        params.dto = { status: 'APPROVED' }
      }

      const res = await SomebodyBlogPage(userId, params)
      if (res) {
        setBlogData({
          list: res.list,
          pagination: {
            current: res.current,
            total: res.total
          }
        })
        dispatch({
          type: 'AccountCenter/setArticlesNum',
          articlesNum: res.total
        })
      }
    } catch (error) {
      console.log('获取博客报错了', error)
    }
    setBistLoading(false)
  }

  const deleteBlog = async (id: API.BlogInfo['id']) => {
    setBistLoading(true)
    try {
      await DeleteBlogApi(id)
      message.success(
        intl.formatMessage({
          id: 'pages.form.delete.success',
          defaultMessage: '删除成功！'
        })
      )
      getBlogList()
    } catch (error) {
      message.success(
        intl.formatMessage({
          id: 'pages.form.delete.error',
          defaultMessage: '删除失败，请重试！'
        })
      )
    }
    setBistLoading(false)
  }

  const goDetail = (id: string | number) => {
    history.push(`/article/${id}`)
  }

  const isIncludeMe = (type: OperationItem['key'], blogDataArr: API.BlogDataItem[]) => {
    if (!loginUserId) return false
    if (!blogDataArr || blogDataArr.length <= 0) return false
    const blogDataObj = blogDataArr[0]

    let flag = false
    switch (type) {
      case 'LIKE':
        flag = blogDataObj.likeArr.includes(loginUserId)
        break
      case 'DISLIKE':
        flag = blogDataObj.dislikeArr.includes(loginUserId)
        break
      case 'COLLECT':
        flag = blogDataObj.collectionArr.includes(loginUserId)
        break
      default:
        break
    }
    return flag
  }

  const itemActions = (item: API.BlogInfo) => {
    const arr = [
      <IconText icon={EyeOutlined} text={item.reads} key='list-vertical-reads' />,
      <IconText
        text={item.likes}
        key='list-vertical-likes'
        icon={isIncludeMe('LIKE', item.blogDataArr) ? LikeFilled : LikeOutlined}
        className={`${isIncludeMe('LIKE', item.blogDataArr) ? 'blog-list-item-action-active' : ''}`}
      />,
      <IconText
        text={item.dislikes}
        key='list-vertical-dislikes'
        icon={isIncludeMe('DISLIKE', item.blogDataArr) ? DislikeFilled : DislikeOutlined}
        className={`${
          isIncludeMe('DISLIKE', item.blogDataArr) ? 'blog-list-item-action-active' : ''
        }`}
      />,
      <IconText
        text={item.collections}
        key='list-vertical-collections'
        icon={isIncludeMe('COLLECT', item.blogDataArr) ? StarFilled : StarOutlined}
        className={`${
          isIncludeMe('COLLECT', item.blogDataArr) ? 'blog-list-item-action-active' : ''
        }`}
      />,
      <IconText icon={MessageOutlined} text={item.comments} key='list-vertical-comments' />
    ]

    if (isMe) {
      // 是自己时，显示博文状态和其他图标
      const status = toObj(BLOG_STATUS)[item.status]
      arr.unshift(
        <IconText
          key='blog-status'
          icon={StockOutlined}
          text={
            item.status === 'REJECT' ? (
              <Popover
                trigger='hover'
                content={item.rejectReason || '无'}
                title={intl.formatMessage({
                  id: 'pages.form.rejectReason',
                  defaultMessage: '驳回原因'
                })}
              >
                <a>{status}</a>
              </Popover>
            ) : (
              status
            )
          }
        />
      )
    }

    return arr
  }

  const initList = async () => {
    setFirstEnter(true)
    await getBlogList()
    setFirstEnter(false)
  }

  useEffect(() => {
    // 每次id不一样，都要发请求
    initList()
  }, [userId])

  return (
    <BlogListSkeleton split className={styles.skeleton} loading={firstEnter}>
      <List
        size='large'
        loading={listLoading}
        itemLayout='vertical'
        pagination={{
          ...blogData.pagination,
          itemRender,
          onChange: getBlogList
        }}
        className={styles.blogList}
        dataSource={blogData?.list}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={itemActions(item)}
            extra={
              item.cover && (
                <div className='blog-list-item-cover' onClick={() => goDetail(item.id)}>
                  <img className='blog-list-item-cover-img' alt='cover' src={item.cover} />
                </div>
              )
            }
          >
            <List.Item.Meta
              title={<BlogTitle isMe={isMe} blogInfo={item} deleteBlog={deleteBlog} />}
              description={item.tags.length > 0 && item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
            />
            <div className='blog-list-item-content'>
              <span onClick={() => goDetail(item.id)}>
                {item.content && item.content.replace(/<[^>]+>/g, '')}
              </span>
            </div>

            <div className='blog-list-item-time'>{formatTime(item.approvedDate)}</div>
          </List.Item>
        )}
      />
    </BlogListSkeleton>
  )
}

export default connect()(Articles)
