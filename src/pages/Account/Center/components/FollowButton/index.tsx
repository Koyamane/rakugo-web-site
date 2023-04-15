import { FollowSomeBodyApi, IsFollowedApi } from '@/components/FollowButton/services'
import useParamsRedirect from '@/hooks/useParamsRedirect'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'
import { connect, Dispatch, useIntl } from '@umijs/max'
import { App, Button, ButtonProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { AccountCenterState } from '../../data'
import '../../index.less'

interface FollowButtonProps {
  targetId: string
  userId?: string
  dispatch: Dispatch
  followersNum: number
}

const FollowButton: React.FC<FollowButtonProps & ButtonProps> = React.memo(props => {
  const { targetId, userId, followersNum, dispatch, ...otherProps } = props
  const intl = useIntl()
  const paramsRedirect = useParamsRedirect()
  const [isFollowed, setIsFollowed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  const getFollowed = async () => {
    // 自己，不发请求
    if (targetId === userId) return

    // 说明默认为已关注，不用查询
    if (isFollowed) return

    if (!userId || !targetId) {
      setIsFollowed(false)
      return
    }

    setLoading(true)

    try {
      const res = await IsFollowedApi(targetId)
      setIsFollowed(res.isFollowed)
    } catch (error) {
      setIsFollowed(false)
    }
    setLoading(false)
  }

  const handleFollow = async () => {
    if (!userId) {
      paramsRedirect()
      return
    }

    if (targetId === userId) {
      message.info(
        intl.formatMessage({
          id: 'pages.account.follow.error',
          defaultMessage: '不能关注自己'
        })
      )
      return
    }

    setLoading(true)
    try {
      const res = await FollowSomeBodyApi(targetId, userId)
      setIsFollowed(res.isFollowed)
      if (!res.isFollowed) {
        message.success(
          intl.formatMessage({
            id: 'pages.account.unfollowed',
            defaultMessage: '已取关'
          })
        )
        dispatch({
          type: 'AccountCenter/setFollowersNum',
          followersNum: followersNum - 1
        })
      } else {
        dispatch({
          type: 'AccountCenter/setFollowersNum',
          followersNum: followersNum + 1
        })
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    getFollowed()
  }, [])

  return (
    <Button
      type='text'
      size='small'
      shape='default'
      loading={loading}
      onClick={handleFollow}
      className='account-center-follow-item-button'
      icon={isFollowed ? <CheckOutlined /> : <PlusOutlined />}
      {...otherProps}
    >
      {isFollowed
        ? intl.formatMessage({
            id: 'pages.account.followed',
            defaultMessage: '已关注'
          })
        : intl.formatMessage({
            id: 'pages.account.follow',
            defaultMessage: '关注'
          })}
    </Button>
  )
})

export default connect(({ AccountCenter }: { AccountCenter: AccountCenterState }) => ({
  followersNum: AccountCenter.followersNum
}))(FollowButton)
