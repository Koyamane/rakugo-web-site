/*
 * @Author: dingyun
 * @Date: 2021-12-25 23:14:57
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-22 23:42:36
 * @Description:
 */
import { BackTop } from '@/components'
import IconText from '@/components/IconText'
import { GetUserInfo } from '@/services/global'
import { ContactsOutlined, HomeOutlined, SmileOutlined } from '@ant-design/icons'
import { PageLoading } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, Helmet, useIntl, useModel, useParams } from '@umijs/max'
import { Card, Col, Divider, Row, Space, Tag } from 'antd'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import Articles from './components/Articles'
import Collections from './components/Collections'
import FollowButton from './components/FollowButton'
import Follows from './components/Follows'
import type { tabKeyType } from './data'

const Center: React.FC = () => {
  const intl = useIntl()
  const [tabKey, setTabKey] = useState<tabKeyType>('articles')
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<API.UserInfo>()
  const { initialState } = useModel('@@initialState')
  const { setTo404 } = useModel('use404Model')
  const {
    setNums,
    nums: { articlesNum, collectionsNum, followsNum, followersNum }
  } = useModel('useAccount')
  // 登录的用户
  const { currentUser: loginUser } = initialState || {}
  const { userId } = useParams<{ userId: string }>()

  const isMe = useMemo(() => {
    return loginUser?.userId === userId
  }, [userId])

  //  获取页面的用户信息，默认不发请求
  const getCurrentUserInfo = async () => {
    setLoading(true)
    try {
      const res = await GetUserInfo(userId)
      setCurrentUser({ ...res })
      setNums({
        articlesNum: res.blogs,
        collectionsNum: res.collections,
        followsNum: res.watchers,
        followersNum: res.followers
      })
    } catch (error: any) {
      if (error?.info?.errorCode === 404) setTo404(true)
    }

    setLoading(false)
  }

  const operationTabList = useMemo(() => {
    return [
      {
        key: 'articles',
        tab: (
          <>
            <FormattedMessage id='pages.account.menuMap.articles' defaultMessage='文章' />
            <span>({articlesNum})</span>
          </>
        )
      },
      {
        key: 'collections',
        tab: (
          <>
            <FormattedMessage id='pages.account.menuMap.collections' defaultMessage='收藏' />
            <span>({collectionsNum})</span>
          </>
        )
      },
      {
        key: 'follows',
        tab: (
          <>
            <FormattedMessage id='pages.account.menuMap.follows' defaultMessage='关注列表' />
            <span>({followsNum})</span>
          </>
        )
      }
    ]
  }, [articlesNum, collectionsNum, followsNum])

  //  渲染用户信息
  const renderUserInfo = ({ post, country, area, address }: Partial<API.UserInfo>) => {
    return (
      <Row className='user-info-card-middle' justify='center' gutter={[0, 10]}>
        <Col span={24}>
          <IconText align='start' icon={ContactsOutlined} text={post} />
        </Col>
        <Col span={24}>
          <IconText align='start' icon={SmileOutlined} text={country?.label} />
        </Col>
        <Col span={24}>
          <IconText
            align='start'
            icon={HomeOutlined}
            text={
              <span>
                {area && area.join('')}
                {address}
              </span>
            }
          />
        </Col>
      </Row>
    )
  }

  // 渲染tab切换
  const renderChildrenByTabKey = (tabValue: tabKeyType) => {
    if (!currentUser?.userId) return null

    switch (tabValue) {
      case 'articles':
        return <Articles isMe={isMe} userId={currentUser?.userId} loginUserId={loginUser?.userId} />
      case 'collections':
        return <Collections isMe={isMe} userId={currentUser?.userId} />
      case 'follows':
        return <Follows isMe={isMe} userId={currentUser?.userId} />
      default:
        break
    }

    return null
  }

  useLayoutEffect(() => {
    getCurrentUserInfo()
  }, [userId])

  const centerClassName = useEmotionCss(({ token }) => ({
    '.account-center-left': {
      position: 'sticky',
      top: token.marginMD
    },

    '.user-info-card': {
      background: token.colorBgContainer,
      color: token.colorText,
      marginBottom: token.marginMD,
      borderRadius: token.borderRadius,
      padding: `${token.paddingMD}px ${token.paddingMD}px ${token.paddingSM}px`,

      '&-top': {
        textAlign: 'center',
        marginBlockEnd: token.marginLG,

        '&>img': {
          width: '104px',
          height: '104px',
          borderRadius: '50%',
          marginBottom: token.marginMD
        },

        '&-name': {
          wordBreak: 'break-all',
          marginBlockEnd: token.marginXXS,
          fontWeight: token.fontWeightStrong,
          fontSize: token.fontSizeHeading3
        },

        '&-follow': {
          marginBlockStart: token.marginXS,

          '&-item': {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',

            '&-num': {
              fontSize: token.fontSizeHeading4,
              fontWeight: token.fontWeightStrong
            },

            '&-title': {
              fontSize: token.fontSizeSM,
              color: token.colorTextDescription
            }
          }
        }
      },

      '&-middle': {
        paddingInline: token.paddingLG
      },

      '&-tags': {
        '.ant-tag': {
          marginBlockEnd: token.marginXS
        },

        '&-title': {
          marginBlockEnd: token.marginSM,
          color: token.colorTextHeading,
          fontWeight: token.fontWeightStrong
        }
      }
    },

    '.account-center-right': {
      '.ant-card': {
        boxShadow: 'none'
      },

      '.ant-card-head': {
        paddingInline: token.paddingMD
      },

      '.ant-card-body': {
        padding: '0'
      }
    },

    [`@media screen and (max-width: ${token.screenLG}px)`]: {
      '&.ant-row': {
        // margin: '0 !important'
      },

      '.account-center-left': {
        position: 'relative',
        top: 'auto'
      }
    }
  }))

  return currentUser && !loading ? (
    <>
      <Helmet>
        <title>
          {currentUser.nickname} - {intl.formatMessage({ id: 'pages.layouts.site.title' })}
        </title>
      </Helmet>

      <Row gutter={20} align='top' className={centerClassName}>
        <Col lg={8} md={24} sm={24} xs={24} className='account-center-left'>
          <div className='user-info-card'>
            <div className='user-info-card-top'>
              <img src={currentUser.avatar} alt='avatar' />
              <div className='user-info-card-top-name'>{currentUser.nickname}</div>
              <div>{currentUser?.signature}</div>
              <Space size='large' className='user-info-card-top-follow'>
                <div className='user-info-card-top-follow-item'>
                  <span className='user-info-card-top-follow-item-num'>{followsNum}</span>
                  <span className='user-info-card-top-follow-item-title'>
                    <FormattedMessage id='pages.account.watchers' defaultMessage='关注数' />
                  </span>
                </div>
                <div className='user-info-card-top-follow-item'>
                  <span className='user-info-card-top-follow-item-num'>{followersNum}</span>
                  <span className='user-info-card-top-follow-item-title'>
                    <FormattedMessage id='pages.account.followers' defaultMessage='粉丝数' />
                  </span>
                </div>
                {!isMe && (
                  <FollowButton userId={loginUser?.userId} targetId={currentUser.userId!} />
                )}
              </Space>
            </div>

            {renderUserInfo(currentUser)}

            <Divider dashed />

            <div className='user-info-card-tags'>
              <div className='user-info-card-tags-title'>
                <FormattedMessage id='pages.account.basic.tags' defaultMessage='标签' />
              </div>
              {currentUser.tags && currentUser.tags.map(item => <Tag key={item}>{item}</Tag>)}
            </div>
          </div>
        </Col>

        <Col lg={16} md={24} sm={24} xs={24} className='account-center-right'>
          <Card
            bordered={false}
            activeTabKey={tabKey}
            tabList={operationTabList}
            onTabChange={(_tabKey: string) => {
              setTabKey(_tabKey as tabKeyType)
            }}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>

      <BackTop />
    </>
  ) : (
    <PageLoading />
  )
}

export default Center
