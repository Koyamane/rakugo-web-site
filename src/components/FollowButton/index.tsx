import useParamsRedirect from '@/hooks/useParamsRedirect'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl, useModel } from '@umijs/max'
import { App, Button, ButtonProps } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { FollowSomeBodyApi, IsFollowedApi } from './services'

interface FollowButtonProps {
  targetId: string
  mobileMode?: boolean
  followHintId?: string
  followedValue?: boolean
  notInit?: boolean
  isFollowed?: boolean
  onFollowed?: (followsNum?: number, isFollowed?: boolean) => void
  onFollowChange?: (isFollowed: boolean) => void
}

const FollowButton: React.FC<FollowButtonProps & ButtonProps> = React.memo(props => {
  const {
    followedValue,
    notInit,
    isFollowed,
    mobileMode,
    targetId,
    onFollowed,
    followHintId,
    onFollowChange,
    className,
    ...otherProps
  } = props
  const intl = useIntl()
  const { message } = App.useApp()
  const paramsRedirect = useParamsRedirect()
  const [loading, setLoading] = useState(false)
  const [followed, setFollowed] = useState(!!isFollowed)
  const { initialState } = useModel('@@initialState')
  const userId = initialState?.currentUser?.userId
  const curFollowed = useMemo(() => {
    return followedValue ?? followed
  }, [followed, followedValue])

  const followButtonClassName = useEmotionCss(({ token }) => {
    return {
      '.follow-button': {
        '&.ant-btn': {
          fontSize: token.fontSizeSM
        },

        '&.ant-btn-default': {
          color: token.colorTextDescription
        }
      },
      '.follow-button-mobile': {
        position: 'fixed',
        bottom: '100px',
        left: '6%',
        display: 'none',
        border: 'none',
        boxShadow: token.boxShadow,

        '&.ant-btn-default': {
          background: token.colorBgElevated
        }
      },

      [`@media screen and (max-width: ${token.screenSM}px)`]: {
        '.follow-button-hidden': {
          display: 'none'
        },

        '.follow-button-mobile.ant-btn': {
          display: 'block'
        }
      }
    }
  })

  const setIsFollowed = (flag: boolean) => {
    setFollowed(flag)
    onFollowChange && onFollowChange(flag)
  }

  const getFollowed = async () => {
    // 说明默认为已关注，不用查询
    if (isFollowed || notInit) return

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
      } else if (mobileMode && document.documentElement.clientWidth <= 576) {
        message.success(
          intl.formatMessage({
            id: 'pages.account.followed',
            defaultMessage: '已关注'
          })
        )
      }
      onFollowed && onFollowed(res.num, res.isFollowed)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    getFollowed()
  }, [])

  return (
    <div className={followButtonClassName}>
      <Button
        loading={loading}
        size='small'
        shape='round'
        onClick={handleFollow}
        type={curFollowed ? 'primary' : 'default'}
        className={classNames('follow-button', mobileMode && 'follow-button-hidden', className)}
        {...otherProps}
      >
        {curFollowed
          ? intl.formatMessage({
              id: 'pages.account.followed',
              defaultMessage: '已关注'
            })
          : intl.formatMessage({
              id: followHintId || 'pages.account.follow',
              defaultMessage: '关注'
            })}
      </Button>

      {mobileMode && (
        <Button
          loading={loading}
          size='large'
          shape='circle'
          onClick={handleFollow}
          type={curFollowed ? 'primary' : 'default'}
          className='follow-button follow-button-mobile'
          icon={curFollowed ? <CheckOutlined /> : <PlusOutlined />}
          {...otherProps}
        />
      )}
    </div>
  )
})

export default FollowButton
