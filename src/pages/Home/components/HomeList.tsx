/*
 * @Author: dingyun
 * @Date: 2023-04-12 22:45:02
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-28 18:16:13
 * @Description:
 */
import { BlogListSkeleton, IconText } from '@/components'
import { useGlobalClassName, useGlobalHooks } from '@/hooks'
import useFormatTime from '@/hooks/useFormatTime'
import { BlogPageApi } from '@/pages/Admin/BlogManagement/service'
import { throttle } from '@/utils/tools'
import {
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  StarFilled,
  StarOutlined
} from '@ant-design/icons'
import { NavLink, useIntl } from '@umijs/max'
import { Divider, Skeleton, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BlogSortKey } from '../data'

const HomeList: React.FC<{ sortKey: BlogSortKey; userId?: string }> = React.memo(
  ({ sortKey, userId }) => {
    const intl = useIntl()
    const formatTime = useFormatTime()
    const { isIncludeMe } = useGlobalHooks()
    const [firstEnter, setFirstEnter] = useState(true)
    const { contentListClassName, noMoreClassName } = useGlobalClassName()
    const [blogData, setBlogData] = useState<{
      list: API.BlogInfo[]
      pagination: { current: number; total: number }
    }>({
      list: [],
      pagination: { current: 1, total: 0 }
    })

    const getBlogList = async (current: number = 1) => {
      try {
        const res = await BlogPageApi({
          dto: { status: 'APPROVED' },
          sort: { [sortKey]: -1 },
          current
        })
        res &&
          setBlogData({
            list: res.list,
            pagination: {
              current: res.current,
              total: res.total
            }
          })
      } catch (error) {
        console.log('获取首页博客报错了', error)
      }
    }

    const loadMoreData = async () => {
      throttle(async () => {
        try {
          const res = await BlogPageApi({
            dto: { status: 'APPROVED' },
            sort: { [sortKey]: -1 },
            current: blogData.pagination.current + 1
          })
          setBlogData({
            list: [...blogData.list, ...res.list],
            pagination: {
              current: res.current,
              total: res.total
            }
          })
        } catch (error) {
          console.log('获取博客失败了', error)
        }
      })()
    }

    const initList = async () => {
      setFirstEnter(true)
      await getBlogList()
      setFirstEnter(false)
    }

    useEffect(() => {
      initList()
    }, [sortKey])

    return (
      <BlogListSkeleton num={2} className='home-layout-blog-list' loading={firstEnter}>
        <InfiniteScroll
          next={loadMoreData}
          scrollableTarget='scrollableDiv'
          dataLength={blogData.list.length}
          hasMore={blogData.list.length < blogData.pagination.total}
          loader={<Skeleton paragraph={{ rows: 4 }} active />}
          endMessage={
            <div className={noMoreClassName}>
              {intl.formatMessage({ id: 'pages.blog.noMore', defaultMessage: '没有更多了' })}
            </div>
          }
        >
          {!!blogData.list.length && (
            <div className={contentListClassName}>
              {blogData.list.map(item => (
                <div key={item.id} className='content-list-item'>
                  <div className='content-list-item-left'>
                    <div className='content-list-item-left-userInfo'>
                      {formatTime(item.approvedDate)}
                      <Divider type='vertical' />
                      <NavLink target='_blank' to={`/account/center/${item.createdId}`}>
                        {item.createdName}
                      </NavLink>
                      <Divider type='vertical' />
                      {item.tags.join('・')}
                    </div>
                    <div className='content-list-item-left-title text-ellipsis'>
                      <NavLink target='_blank' to={`/article/${item.id}`}>
                        {item.title}
                      </NavLink>
                    </div>

                    <div className='content-list-item-left-body'>{item.summary}</div>

                    <Space size='large' className='content-list-item-left-actions'>
                      <IconText icon={EyeOutlined} text={item.reads} />
                      <IconText
                        text={item.likes}
                        icon={
                          isIncludeMe('LIKE', item.blogDataArr, userId) ? LikeFilled : LikeOutlined
                        }
                        className={`${
                          isIncludeMe('LIKE', item.blogDataArr, userId) &&
                          'content-list-item-left-actions-active'
                        }`}
                      />
                      <IconText
                        text={item.collections}
                        icon={
                          isIncludeMe('COLLECT', item.blogDataArr, userId)
                            ? StarFilled
                            : StarOutlined
                        }
                        className={`${
                          isIncludeMe('COLLECT', item.blogDataArr, userId) &&
                          'content-list-item-left-actions-active'
                        }`}
                      />
                      <IconText text={item.comments} icon={MessageOutlined} />
                    </Space>
                  </div>

                  {item.cover && (
                    <NavLink
                      target='_blank'
                      className='content-list-item-right'
                      to={`/article/${item.id}`}
                    >
                      <img
                        src={item.cover}
                        alt={item.title}
                        className='content-list-item-right-cover'
                      />
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          )}
        </InfiniteScroll>
      </BlogListSkeleton>
    )
  }
)

export default HomeList
