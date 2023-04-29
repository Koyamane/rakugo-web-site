import BlogListSkeleton from '@/components/BlogListSkeleton'
import IconText from '@/components/IconText'
import useFormatTime from '@/hooks/useFormatTime'
import usePaginationItem from '@/hooks/usePaginationItem'
import { EyeOutlined, UserOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, NavLink, useModel } from '@umijs/max'
import { Divider, Pagination, Space, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { BlogCollectionPage } from '../../service'
import CancelCollect from './CancelCollect'

interface SelfProps {
  isMe?: boolean
  userId?: API.UserInfo['userId']
}

const Articles: React.FC<SelfProps> = ({ isMe, userId }) => {
  const [listLoading, setBistLoading] = useState(true)
  const [firstEnter, setFirstEnter] = useState(true)
  const formatTime = useFormatTime()
  const itemRender = usePaginationItem()
  const { setNums } = useModel('useAccount')
  const [collectionData, setCollectionData] = useState<{
    list: any[]
    pagination: { current: number; total: number }
  }>({
    list: [],
    pagination: { current: 1, total: 0 }
  })

  const getBlogCollectList = async (current: number = collectionData.pagination.current) => {
    setBistLoading(true)
    try {
      const params = {
        dto: { userId: userId! },
        current
      }

      const res = await BlogCollectionPage(params)
      if (res) {
        setCollectionData({
          list: res.list,
          pagination: {
            current: res.current,
            total: res.total
          }
        })
        setNums(values => ({
          ...values,
          collectionsNum: res.total
        }))
      }
    } catch (error) {
      console.log('获取收藏报错了', error)
    }
    setBistLoading(false)
  }

  const initList = async () => {
    setFirstEnter(true)
    await getBlogCollectList()
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
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBlock: token.paddingSM,
      color: token.colorTextDescription,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,

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
        marginBlockEnd: token.marginXXS
      },

      '&-expired': {
        textAlign: 'center',
        fontSize: token.fontSizeXL,
        fontWeight: token.fontWeightStrong
      },

      '&-actions': {
        display: 'flex',
        justifyContent: 'space-between'
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
          {collectionData.list.map(item => (
            <div key={item.id} className='content-list-item'>
              {item.status === 'DELETED' ? (
                <>
                  <div className='content-list-item-userInfo'>{formatTime(item.approvedDate)}</div>

                  <div className='content-list-item-expired'>
                    <FormattedMessage id='pages.account.expired' defaultMessage='已失效' />
                  </div>

                  <div className='content-list-item-actions'>
                    <IconText
                      key='list-vertical-user'
                      icon={UserOutlined}
                      text={
                        <NavLink target='_blank' to={`/account/center/${item.userId}`}>
                          {item.username}
                        </NavLink>
                      }
                    />

                    {isMe && <CancelCollect blogInfo={item} onCancelled={initList} />}
                  </div>
                </>
              ) : (
                <>
                  <div className='content-list-item-userInfo'>
                    {formatTime(item.approvedDate)}
                    <Divider type='vertical' />
                    {item.tags.join('・')}
                  </div>

                  <div className='content-list-item-title text-ellipsis'>
                    <NavLink target='_blank' to={`/article/${item.id}`}>
                      {item.title}
                    </NavLink>
                  </div>

                  <div className='content-list-item-body text-ellipsis'>{item.summary}</div>

                  <div className='content-list-item-actions'>
                    <Space size='middle'>
                      <IconText
                        key='list-vertical-user'
                        icon={UserOutlined}
                        text={
                          <NavLink target='_blank' to={`/account/center/${item.createdId}`}>
                            {item.createdName}
                          </NavLink>
                        }
                      />
                      <IconText icon={EyeOutlined} text={item.reads} />
                    </Space>

                    {isMe && <CancelCollect blogInfo={item} onCancelled={initList} />}
                  </div>
                </>
              )}
            </div>
          ))}

          <Pagination
            itemRender={itemRender}
            onChange={getBlogCollectList}
            {...collectionData.pagination}
          />
        </div>
      </Spin>
    </BlogListSkeleton>
  )
}

export default Articles
