import { FollowSomeBodyApi, IsFollowedApi } from '@/components/FollowButton/services'
import useParamsRedirect from '@/hooks/useParamsRedirect'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl, useModel } from '@umijs/max'
import { App, Button, ButtonProps } from 'antd'
import React, { useEffect, useState } from 'react'

interface FollowButtonProps {
  targetId: string
  userId?: string
}

const FollowButton: React.FC<FollowButtonProps & ButtonProps> = React.memo(props => {
  const { targetId, userId, ...otherProps } = props
  const intl = useIntl()
  const paramsRedirect = useParamsRedirect()
  const [isFollowed, setIsFollowed] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    setNums,
    nums: { followersNum }
  } = useModel('useAccount')
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
        setNums(values => ({
          ...values,
          followersNum: followersNum - 1
        }))
      } else {
        setNums(values => ({
          ...values,
          followersNum: followersNum - 1
        }))
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    getFollowed()
  }, [])

  const followBtnClassName = useEmotionCss(({ token }) => ({
    '&.ant-btn': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 'auto',
      paddingInline: token.paddingXS,
      marginInline: -token.marginXS,
      border: 'none'
    },

    '&.ant-btn > span:first-child': {
      fontWeight: token.fontWeightStrong,
      fontSize: token.fontSizeHeading4,
      lineHeight: token.lineHeight,

      '& > span': {
        padding: '0'
      },

      '& > svg': {
        verticalAlign: 'inherit'
      }
    },

    '&.ant-btn > span:last-child': {
      margin: 0,
      fontSize: token.fontSizeSM,
      color: token.colorTextDescription
    }
  }))

  return (
    <Button
      type='text'
      size='small'
      shape='default'
      loading={loading}
      onClick={handleFollow}
      className={followBtnClassName}
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

export default FollowButton
