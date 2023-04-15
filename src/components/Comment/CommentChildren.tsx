/*
 * @Author: dingyun
 * @Date: 2023-04-15 11:47:18
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-15 17:43:27
 * @Description:
 */
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useModel } from '@umijs/max'
import { Pagination, Spin } from 'antd'
import React, { useMemo, useState } from 'react'
import CommentItem from './CommentItem'
import { CommentChildrenProps, CommentChildrenType } from './data'
import { CommentPageApi } from './services'

const CommentChildren: React.FC<CommentChildrenProps> = React.memo(props => {
  const { targetId, commentInfo, targetType } = props
  const { likeObj, setLikeObj } = useModel('useComment')
  const [showMore, setShowMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [commentData, setCommentData] = useState<{
    list: CommentChildrenType[]
    pagination: { current: number; total: number }
  }>({
    list: [],
    pagination: { current: 1, total: 0 }
  })

  const commentList = useMemo(() => {
    if (showMore) {
      return commentData.list
    }

    return commentInfo.children
  }, [commentInfo.children, commentData.list])

  const getCommentList = async (params?: API.PageParams) => {
    if (!targetId) return

    setLoading(true)

    try {
      const res = await CommentPageApi({
        dto: { targetId, targetType: targetType!, parentId: commentInfo.id },
        ...params
      })
      setCommentData({
        list: res.list,
        pagination: {
          current: res.current,
          total: res.total
        }
      })
      setLikeObj(res.list, true)
    } catch (error) {
      console.log('获取评论失败了')
    }
    setLoading(false)
  }

  const onPageSizeChange = (current: number) => {
    getCommentList({ current })
  }

  const handleShowMore = () => {
    setShowMore(true)
    getCommentList()
  }

  const BottomPagination = () => {
    if (showMore) {
      return (
        <Pagination
          size='small'
          showQuickJumper
          onChange={onPageSizeChange}
          total={commentInfo.childrenTotal}
          current={commentData.pagination.current}
          className='comment-children-pagination'
        />
      )
    }

    if (
      commentInfo.children.length !== commentInfo.childrenTotal &&
      commentInfo.childrenTotal > 2
    ) {
      // 共10条回复
      // 10 replies in total
      // 合計10件の返事

      // 还需国际化
      return (
        <div className='comment-children-more'>
          <FormattedMessage id='component.comment.total' />
          &nbsp;{commentInfo.childrenTotal}&nbsp;
          <FormattedMessage id='component.comment.repliesInTotal' />
          <span onClick={handleShowMore}>
            <FormattedMessage id='component.comment.clickToView' />
          </span>
        </div>
      )
    }

    return <></>
  }

  const CommentChildrenClassName = useEmotionCss(({ token }) => {
    return {
      '.comment-children-pagination': {
        marginBlockStart: token.marginSM,
        marginBlockEnd: -token.marginXS
      },

      '.comment-children-more': {
        display: 'inline-block',
        fontSize: token.fontSizeSM,
        color: token.colorTextDescription,
        transform: `translateY(${token.marginXS}px)`,

        span: {
          cursor: 'pointer',
          '&:hover': {
            color: token.colorPrimaryTextHover
          }
        }
      }
    }
  })

  return (
    <Spin spinning={loading}>
      {/* 不加这个 div，样式上不去 */}
      <div className={CommentChildrenClassName}>
        {commentList.map(
          item => likeObj[item.id] && <CommentItem key={item.id} commentInfo={item as any} />
        )}

        <BottomPagination />
      </div>
    </Spin>
  )
})

export default CommentChildren
