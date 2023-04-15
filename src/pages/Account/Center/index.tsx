/*
 * @Author: dingyun
 * @Date: 2021-12-25 23:14:57
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-12 20:56:28
 * @Description: 有id时，就是别人的详情页面，没有就是自己的详情页面
 */
import { BackTop } from '@/components'
import IconText from '@/components/IconText'
import { GetUserInfo } from '@/services/global'
import { ContactsOutlined, HomeOutlined, SmileOutlined } from '@ant-design/icons'
import { connect, FormattedMessage, useModel, useParams } from '@umijs/max'
import { Card, Col, Divider, Row, Space, Tag } from 'antd'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import Articles from './components/Articles'
import Collections from './components/Collections'
import FollowButton from './components/FollowButton'
import Follows from './components/Follows'
import type { AccountCenterState, AccountProps, tabKeyType } from './data'
import styles from './index.less'

const Center: React.FC<AccountProps> = ({
  articlesNum,
  collectionsNum,
  followsNum,
  followersNum,
  dispatch
}) => {
  const [tabKey, setTabKey] = useState<tabKeyType>('articles')
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<API.UserInfo>()
  const { initialState } = useModel('@@initialState')
  const { setTo404 } = useModel('use404Model')
  // 登录的用户
  const { currentUser: loginUser } = initialState || {}
  const { userId } = useParams<{ userId: string }>()

  const isMe = useMemo(() => {
    return !userId || loginUser?.userId === userId
  }, [userId])

  //  获取页面的用户信息，默认不发请求
  const getCurrentUserInfo = async () => {
    setLoading(true)
    try {
      const res = await GetUserInfo(userId)
      setCurrentUser({ ...res })
      dispatch({
        type: 'AccountCenter/setAllNum',
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
      <Row className={styles.detail} justify='center' gutter={[0, 10]}>
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

  return (
    <>
      {currentUser && (
        <Row gutter={24}>
          <Col lg={8} md={24} sm={24} xs={24}>
            <Card bordered={false} className={styles.userInfoCard} loading={loading}>
              <div className={styles.avatarHolder}>
                <img src={currentUser.avatar} alt='avatar' />
                <div className={styles.name}>{currentUser.nickname}</div>
                <div>{currentUser?.signature}</div>
                <Space size='large' className={styles.followContent}>
                  <div className={styles.followItem}>
                    <span className={styles.followItemNum}>{followsNum}</span>
                    <span className={styles.followItemTitle}>
                      <FormattedMessage id='pages.account.watchers' defaultMessage='关注数' />
                    </span>
                  </div>
                  <div className={styles.followItem}>
                    <span className={styles.followItemNum}>{followersNum}</span>
                    <span className={styles.followItemTitle}>
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

              <div className={styles.tags}>
                <div className={styles.tagsTitle}>
                  <FormattedMessage id='pages.account.basic.tags' defaultMessage='标签' />
                </div>
                {currentUser.tags && currentUser.tags.map(item => <Tag key={item}>{item}</Tag>)}
              </div>

              {/* <Divider style={{ marginTop: 16 }} dashed />
                <div className={styles.team}>
                  <div className={styles.teamTitle}>团队</div>
                  <Row gutter={36}>
                    {currentUser.notice &&
                      currentUser.notice.map((item) => (
                        <Col key={item.id} lg={24} xl={12}>
                          <Link to={item.href}>
                            <Avatar size="small" src={item.logo} />
                            {item.member}
                          </Link>
                        </Col>
                      ))}
                  </Row>
                </div> */}
            </Card>
          </Col>

          <Col lg={16} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              activeTabKey={tabKey}
              tabList={operationTabList}
              className={styles.tabsCard}
              onTabChange={(_tabKey: string) => {
                setTabKey(_tabKey as tabKeyType)
              }}
            >
              {renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      )}

      <BackTop />
    </>
  )
}

export default connect(({ AccountCenter }: { AccountCenter: AccountCenterState }) => ({
  articlesNum: AccountCenter.articlesNum,
  collectionsNum: AccountCenter.collectionsNum,
  followsNum: AccountCenter.followsNum,
  followersNum: AccountCenter.followersNum
}))(Center)
