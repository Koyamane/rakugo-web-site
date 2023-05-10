/*
 * @Author: dingyun
 * @Date: 2023-04-12 22:45:02
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-10 11:11:48
 * @Description:
 */
import { BlogListSkeleton, IconText } from '@/components'
import { useGlobalClassName, useFormatTime, useGlobalHooks } from '@/hooks'
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
import { NavLink, useIntl, useSearchParams } from '@umijs/max'
import { Divider, Skeleton, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const SearchList: React.FC<{ searchParams: API.PageParams; userId?: string }> = React.memo(
  ({ searchParams, userId }) => {
    const intl = useIntl()
    const formatTime = useFormatTime()
    const [urlSearch] = useSearchParams()
    const { isIncludeMe } = useGlobalHooks()
    const { contentListClassName, noMoreClassName } = useGlobalClassName()
    const [firstEnter, setFirstEnter] = useState(false)
    const [blogData, setBlogData] = useState<{
      list: API.BlogInfo[]
      pagination: { current: number; total: number }
    }>({
      list: [],
      pagination: { current: 1, total: 0 }
    })

    const someStrAddClass = (str: string, value: string) => {
      return str?.replace(
        new RegExp(value, 'g'),
        `<span class="search-highlight-text">${value}</span>`
      )
    }

    const initList = async (current: number = 1) => {
      if (firstEnter) return

      setFirstEnter(true)

      const value = urlSearch.get('query') || ''

      try {
        const res = await BlogPageApi({
          ...searchParams,
          current,
          searchMap: value ? { title: { opt: 'LIKE', value } } : undefined
        })
        res &&
          setBlogData({
            list: res.list.map((item: { title: string; summary: string }) => ({
              ...item,
              title: someStrAddClass(item.title, value),
              summary: someStrAddClass(item.summary, value)
            })),
            pagination: {
              current: res.current,
              total: res.total
            }
          })
      } catch (error) {
        console.log('获取首页博客报错了', error)
      }

      setFirstEnter(false)
    }

    const loadMoreData = async () => {
      throttle(async () => {
        const value = urlSearch.get('query') || ''
        try {
          const res = await BlogPageApi({
            ...searchParams,
            current: blogData.pagination.current + 1,
            searchMap: value ? { title: { opt: 'LIKE', value } } : undefined
          })
          setBlogData({
            list: [
              ...blogData.list,
              ...res.list.map((item: { title: string; summary: string }) => ({
                ...item,
                title: someStrAddClass(item.title, value),
                summary: someStrAddClass(item.summary, value)
              }))
            ],
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

    useEffect(() => {
      initList()
    }, [searchParams, location.search])

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
                      <NavLink
                        target='_blank'
                        to={`/article/${item.id}`}
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                    </div>

                    <div
                      className='content-list-item-left-body'
                      dangerouslySetInnerHTML={{ __html: item.summary }}
                    />

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

export default SearchList
