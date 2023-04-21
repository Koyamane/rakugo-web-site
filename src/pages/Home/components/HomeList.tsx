/*
 * @Author: dingyun
 * @Date: 2023-04-12 22:45:02
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-21 23:52:52
 * @Description:
 */
import { BlogListSkeleton, IconText } from '@/components'
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
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { NavLink, useIntl } from '@umijs/max'
import { Divider, Skeleton, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BlogSortKey, OperationItem } from '../data'

const HomeList: React.FC<{ sortKey: BlogSortKey; userId?: string }> = React.memo(
  ({ sortKey, userId }) => {
    const intl = useIntl()
    const formatTime = useFormatTime()
    const [firstEnter, setFirstEnter] = useState(true)
    const [blogData, setBlogData] = useState<{
      list: API.BlogInfo[]
      pagination: { current: number; total: number }
    }>({
      list: [],
      pagination: { current: 1, total: 0 }
    })

    const scrollClassName = useEmotionCss(({ token }) => {
      return {
        paddingInline: token.paddingMD,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer
      }
    })

    const contentListClassName = useEmotionCss(({ token }) => {
      return {
        color: token.colorText,

        '.content-list-item': {
          display: 'flex',
          paddingBlock: token.paddingSM,
          justifyContent: 'space-between',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,

          '&-left': {
            flex: '1',
            display: 'flex',
            color: token.colorTextDescription,
            flexDirection: 'column',
            justifyContent: 'space-between',

            '&-userInfo': {
              wordBreak: 'break-all'
            },

            '&-title': {
              fontSize: token.fontSizeLG,
              fontWeight: token.fontWeightStrong,
              marginBlock: token.marginXS,

              a: {
                color: token.colorTextHeading,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }
            },

            '&-body': {
              display: '-webkit-box', // 对象作为伸缩盒子模型展示
              flex: 1,
              overflow: 'hidden',
              color: token.colorText,
              marginBlockEnd: token.marginXXS,
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              WebkitBoxOrient: 'vertical', // 设置或检索伸缩盒子对象的子元素的排列方式
              WebkitLineClamp: '2' // 在第几行上加 ...
            },

            '&-actions-active': {
              color: token.colorPrimaryText
            }
          },

          '&-right': {
            flexShrink: 0,
            borderRadius: token.borderRadius,
            overflow: 'hidden',
            position: 'relative',
            width: '200px',
            minHeight: '133px',
            cursor: 'pointer',
            marginInlineStart: token.marginXS,

            '&-cover': {
              borderRadius: token.borderRadius,
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              transform: 'translate(-50%, -50%)'
            }
          }
        },

        // 放后面权重高，所以媒体查询要放后面来
        [`@media screen and (max-width: ${token.screenMD}px)`]: {
          '.content-list-item': {
            flexDirection: 'column-reverse',
            '&-right': {
              width: '100%',
              minHeight: '180px',
              marginInline: 'auto',
              marginBlockEnd: token.marginSM
            }
          }
        }
      }
    })

    const noMoreClassName = useEmotionCss(({ token }) => {
      return {
        marginBlock: token.marginSM,
        color: token.colorTextDescription,
        textAlign: 'center'
      }
    })

    const isIncludeMe = (type: OperationItem['key'], blogDataArr: API.BlogDataItem[]) => {
      if (!userId) return false
      if (blogDataArr.length <= 0) return false
      const blogDataObj = blogDataArr[0]

      let flag = false
      switch (type) {
        case 'LIKE':
          flag = blogDataObj.likeArr.includes(userId)
          break
        case 'DISLIKE':
          flag = blogDataObj.dislikeArr.includes(userId)
          break
        case 'COLLECT':
          flag = blogDataObj.collectionArr.includes(userId)
          break
        default:
          break
      }
      return flag
    }

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
      <BlogListSkeleton num={3} className='home-layout-blog-list' loading={firstEnter}>
        <InfiniteScroll
          next={loadMoreData}
          className={scrollClassName}
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
                        icon={isIncludeMe('LIKE', item.blogDataArr) ? LikeFilled : LikeOutlined}
                        className={`${
                          isIncludeMe('LIKE', item.blogDataArr) &&
                          'content-list-item-left-actions-active'
                        }`}
                      />
                      <IconText
                        text={item.collections}
                        icon={isIncludeMe('COLLECT', item.blogDataArr) ? StarFilled : StarOutlined}
                        className={`${
                          isIncludeMe('COLLECT', item.blogDataArr) &&
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
