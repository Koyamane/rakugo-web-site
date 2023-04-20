import { FollowButton } from '@/components'
import BlogListSkeleton from '@/components/BlogListSkeleton'
import usePaginationItem from '@/hooks/usePaginationItem'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { NavLink, useModel } from '@umijs/max'
import { Avatar, Pagination, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { UserFollowPage } from '../../service'

interface SelfProps {
  isMe?: boolean
  userId?: API.UserInfo['userId']
}

const Follows: React.FC<SelfProps> = ({ isMe, userId }) => {
  const [listLoading, setBistLoading] = useState(true)
  const [firstEnter, setFirstEnter] = useState(true)
  const itemRender = usePaginationItem()
  const { setNums } = useModel('useAccount')
  const [followData, setFollowData] = useState<{
    list: API.UserInfo[]
    pagination: { current: number; total: number }
  }>({
    list: [],
    pagination: { current: 1, total: 0 }
  })

  const setFollowsNum = (followsNum?: number) => {
    setNums(values => ({
      ...values,
      followsNum: followsNum || 0
    }))
  }

  const getFollowData = async (current: number = followData.pagination.current) => {
    setBistLoading(true)
    try {
      const params = {
        dto: { userId: userId! },
        current
      }

      const res = await UserFollowPage(params)

      setFollowData({
        list: res.list,
        pagination: {
          current: res.current,
          total: res.total
        }
      })

      setFollowsNum(res.total)
    } catch (error) {
      console.log('获取关注列表报错了报错了', error)
    }
    setBistLoading(false)
  }

  const initList = async () => {
    setFirstEnter(true)
    await getFollowData()
    setFirstEnter(false)
  }

  useEffect(() => {
    // 每次id不一样，都要发请求
    initList()
  }, [userId])

  const skeletonClassName = useEmotionCss(({ token }) => ({
    paddingBlockEnd: token.paddingXS
  }))

  const contentListClassName = useEmotionCss(({ token }) => ({
    color: token.colorText,
    paddingInline: token.paddingMD,
    borderRadius: token.borderRadius,
    background: token.colorBgContainer,

    '.content-list-item': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBlock: token.paddingSM,
      color: token.colorTextDescription,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,

      '&-user': {
        flex: '1',
        display: 'flex',
        overflow: 'hidden',
        alignItems: 'center',
        marginInlineEnd: token.marginSM,

        '&-avatar': {
          flexShrink: '0',
          marginInlineEnd: token.marginSM
        },

        '&-right': {
          overflow: 'hidden',
          '&-name': {
            fontSize: token.fontSizeLG,
            marginBlock: token.marginXS
          },

          '&-signature': {
            fontSize: token.fontSizeSM,
            color: token.colorTextDescription
          }
        }
      }
    },

    '.ant-pagination': {
      textAlign: 'center',
      marginBlock: token.marginMD
    }
  }))

  return (
    <BlogListSkeleton split rows={1} className={skeletonClassName} loading={firstEnter}>
      <Spin spinning={listLoading}>
        <div className={contentListClassName}>
          {followData.list.map(item => (
            <div key={item.userId} className='content-list-item'>
              <div className='content-list-item-user'>
                <NavLink
                  target='_blank'
                  to={`/account/center/${item.userId}`}
                  className='content-list-item-user-avatar'
                >
                  <Avatar size='large' src={item.avatar} />
                </NavLink>

                <div className='content-list-item-user-right'>
                  <NavLink
                    target='_blank'
                    to={`/account/center/${item.userId}`}
                    className='content-list-item-user-right-name'
                  >
                    {item.nickname}
                  </NavLink>

                  <div className='content-list-item-user-right-signature text-ellipsis'>
                    {item.signature}
                  </div>
                </div>
              </div>

              {isMe && (
                <FollowButton isFollowed targetId={item.userId!} onFollowed={setFollowsNum} />
              )}
            </div>
          ))}

          <Pagination itemRender={itemRender} onChange={getFollowData} {...followData.pagination} />
        </div>
      </Spin>
    </BlogListSkeleton>
  )
}

export default Follows
