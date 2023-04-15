/*
 * @Author: dingyun
 * @Date: 2023-03-06 13:41:39
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-15 17:55:20
 * @Description:
 */
import useParamsRedirect from '@/hooks/useParamsRedirect'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl, useModel } from '@umijs/max'
import { Divider, Skeleton, Space, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommentBar from './CommentBar'
import CommentChildren from './CommentChildren'
import CommentItem from './CommentItem'
import { CommentChildrenType, CommentProps, CommentType, SortKey } from './data'
import { CommentPageApi } from './services'

const Comment: React.FC<CommentProps> = props => {
  const { targetId, targetType } = props
  const intl = useIntl()
  const [sortKey, setSortKey] = useState<SortKey>('likeArr')
  const paramsRedirect = useParamsRedirect()
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(false)
  const { initialState } = useModel('@@initialState')
  const { likeObj, setLikeObj, currentComment, setCurrentComment } = useModel('useComment')
  const currentUser = initialState?.currentUser
  const [commentData, setCommentData] = useState<{
    list: CommentType[]
    pagination: { current: number; total: number; targetTotal: number }
  }>({
    list: [],
    pagination: { current: 1, total: 0, targetTotal: 0 }
  })

  const getCommentData = async (params?: API.PageParams) => {
    if (!targetId) return

    setInitLoading(true)

    try {
      const res = await CommentPageApi({
        dto: { targetId, targetType: targetType! },
        sort: { [sortKey]: -1 },
        ...params
      })
      setCommentData({
        list: res.list,
        pagination: {
          current: res.current,
          total: res.total,
          targetTotal: res.targetTotal
        }
      })
      setLikeObj(res.list)
    } catch (error) {
      console.log('获取评论失败了')
    }
    setInitLoading(false)
  }

  const loadMoreData = async () => {
    if (loading) return

    setLoading(true)

    try {
      const res = await CommentPageApi({
        dto: { targetId, targetType: targetType! },
        sort: { [sortKey]: -1 },
        current: commentData.pagination.current + 1
      })
      setCommentData({
        list: [...commentData.list, ...res.list],
        pagination: {
          current: res.current,
          total: res.total,
          targetTotal: res.targetTotal
        }
      })
      setLikeObj(res.list, true)
    } catch (error) {
      console.log('获取评论失败了')
    }

    setLoading(false)
  }

  const handleSort = (key: SortKey) => {
    setSortKey(key)
    getCommentData({ sort: { [key]: -1 } })
  }

  const sortBtnClassName = (key: SortKey) => {
    return sortKey === key ? 'comment-title-btn comment-title-btn-active' : 'comment-title-btn'
  }

  const setCommentList = (commentInfo: CommentType) => {
    setCommentData({
      list: [commentInfo, ...commentData.list],
      pagination: {
        current: commentData.pagination.current,
        total: commentData.pagination.total + 1,
        targetTotal: commentData.pagination.targetTotal + 1
      }
    })

    setLikeObj(
      {
        [commentInfo.id]: {
          likes: commentInfo.likeArr.length,
          liked: commentInfo.likeArr.includes(currentUser?.userId || ''),
          dislikes: commentInfo.dislikeArr.length,
          disliked: commentInfo.dislikeArr.includes(currentUser?.userId || '')
        }
      },
      true
    )
  }

  const setCommentListChildren = (commentChildrenInfo: CommentChildrenType) => {
    const list: CommentType[] = JSON.parse(JSON.stringify(commentData.list))
    let idx = 0
    const commentInfo = list.find((item, index) => {
      idx = index
      return item.id === commentChildrenInfo.parentId
    })

    // 不存在则啥都不干
    if (!commentInfo) return

    if (Number(commentChildrenInfo.level) === 2) {
      commentInfo.children.unshift(commentChildrenInfo)
    } else {
      commentInfo.children.push(commentChildrenInfo)
    }
    commentInfo.childrenTotal = commentInfo.childrenTotal + 1
    list.splice(idx, 1, commentInfo)

    setCommentData({
      ...commentData,
      list
    })

    setLikeObj(
      {
        [commentChildrenInfo.id]: {
          likes: commentChildrenInfo.likeArr.length,
          liked: commentChildrenInfo.likeArr.includes(currentUser?.userId || ''),
          dislikes: commentChildrenInfo.dislikeArr.length,
          disliked: commentChildrenInfo.dislikeArr.includes(currentUser?.userId || '')
        }
      },
      true
    )
  }

  useEffect(() => {
    setCurrentComment(undefined)
    setLikeObj({})
    getCommentData()
  }, [])

  const CommentClassName = useEmotionCss(({ token }) => {
    return {
      color: token.colorText,
      borderRadius: token.borderRadius,
      background: token.colorBgContainer,

      '.comment-title': {
        marginBlock: token.marginMD,
        color: token.colorTextDescription,

        '&-name': {
          color: token.colorText,
          fontSize: token.fontSizeXL
        },

        '&-btn': {
          cursor: 'pointer',
          '&:hover': {
            color: token.colorPrimaryTextHover
          },
          '&.comment-title-btn-active': {
            color: token.colorText
          }
        }
      },

      '.comment-no-more': {
        textAlign: 'center',
        color: token.colorTextDescription,
        fontSize: token.fontSizeSM,
        padding: token.paddingMD
      }
    }
  })

  return (
    <div className={CommentClassName}>
      <Divider orientation='center' className='comment-title'>
        <Space size={40}>
          <Space>
            <span className='comment-title-name'>
              {intl.formatMessage({ id: 'pages.blog.comments' })}
            </span>
            <span>{commentData.pagination.targetTotal}</span>
          </Space>

          <Space split={<Divider type='vertical' />}>
            <span className={sortBtnClassName('likeArr')} onClick={() => handleSort('likeArr')}>
              {intl.formatMessage({ id: 'pages.sort.hottest' })}
            </span>
            <span
              className={sortBtnClassName('createdDate')}
              onClick={() => handleSort('createdDate')}
            >
              {intl.formatMessage({ id: 'pages.sort.upToDate' })}
            </span>
          </Space>
        </Space>
      </Divider>

      <CommentBar
        targetId={targetId}
        userInfo={currentUser}
        targetType={targetType}
        setCommentList={setCommentList}
        paramsRedirect={paramsRedirect}
      />

      <Spin spinning={initLoading}>
        <InfiniteScroll
          next={loadMoreData}
          scrollableTarget='scrollableDiv'
          dataLength={commentData.list.length}
          hasMore={commentData.list.length < commentData.pagination.total}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={
            <div className='comment-no-more'>
              {intl.formatMessage({ id: 'pages.comment.noMore' })}
            </div>
          }
        >
          {commentData.list.map(
            (item, index) =>
              likeObj[item.id] && (
                <CommentItem commentInfo={item} key={item.id + index}>
                  {!!item.children.length && (
                    <CommentChildren
                      commentInfo={item}
                      targetId={targetId}
                      targetType={targetType}
                    />
                  )}

                  {(currentComment?.parentId === item.id || currentComment?.id === item.id) && (
                    <div className='margin-bottom-md'>
                      <CommentBar
                        targetId={targetId}
                        userInfo={currentUser}
                        targetType={targetType}
                        commentInfo={currentComment}
                        paramsRedirect={paramsRedirect}
                        setCommentList={setCommentListChildren}
                      />
                    </div>
                  )}
                </CommentItem>
              )
          )}
        </InfiniteScroll>
      </Spin>
    </div>
  )
}

export default Comment
