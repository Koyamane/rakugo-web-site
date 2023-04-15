import BlogListSkeleton from '@/components/BlogListSkeleton'
import FollowButton from '@/components/FollowButton'
import usePaginationItem from '@/hooks/usePaginationItem'
import { UserOutlined } from '@ant-design/icons'
import { connect, Dispatch, NavLink } from '@umijs/max'
import { Avatar, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { UserFollowPage } from '../../service'
import styles from '../Articles/index.less'

interface SelfProps {
  dispatch: Dispatch
  isMe?: boolean
  userId?: API.UserInfo['userId']
}

const Follows: React.FC<SelfProps> = ({ isMe, userId, dispatch }) => {
  const [listLoading, setBistLoading] = useState(true)
  const [firstEnter, setFirstEnter] = useState(true)
  const itemRender = usePaginationItem()
  const [followData, setFollowData] = useState<{
    list: API.UserInfo[]
    pagination: { current: number; total: number }
  }>({
    list: [],
    pagination: { current: 1, total: 0 }
  })

  const setFollowsNum = (followsNum?: number) => {
    dispatch({
      type: 'AccountCenter/setFollowsNum',
      followsNum
    })
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

  return (
    <BlogListSkeleton split rows={2} className={styles.skeleton} loading={firstEnter}>
      <List
        size='large'
        loading={listLoading}
        itemLayout='vertical'
        pagination={{
          ...followData.pagination,
          itemRender,
          onChange: getFollowData
        }}
        className={styles.followList}
        dataSource={followData?.list}
        renderItem={item => (
          <List.Item
            key={item.userId}
            extra={
              isMe ? (
                <FollowButton isFollowed targetId={item.userId!} onFollowed={setFollowsNum} />
              ) : (
                false
              )
            }
          >
            <List.Item.Meta
              description={item.signature}
              avatar={
                <NavLink to={`/account/center/${item.userId}`}>
                  <Avatar size='large' src={item.avatar} icon={<UserOutlined />} />
                </NavLink>
              }
              title={<NavLink to={`/account/center/${item.userId}`}>{item.nickname}</NavLink>}
            />
          </List.Item>
        )}
      />
    </BlogListSkeleton>
  )
}

export default connect()(Follows)
