import BlogListSkeleton from '@/components/BlogListSkeleton'
import IconText from '@/components/IconText'
import useFormatTime from '@/hooks/useFormatTime'
import usePaginationItem from '@/hooks/usePaginationItem'
import { ClockCircleOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import { connect, Dispatch, FormattedMessage, NavLink } from '@umijs/max'
import { List } from 'antd'
import React, { useEffect, useState } from 'react'
import { BlogCollectionPage } from '../../service'
import styles from '../Articles/index.less'
import BlogTitle from './BlogTitle'

interface SelfProps {
  dispatch: Dispatch
  isMe?: boolean
  userId?: API.UserInfo['userId']
}

const Articles: React.FC<SelfProps> = ({ isMe, userId, dispatch }) => {
  const [listLoading, setBistLoading] = useState(true)
  const [firstEnter, setFirstEnter] = useState(true)
  const formatTime = useFormatTime()
  const itemRender = usePaginationItem()
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
        dispatch({
          type: 'AccountCenter/setCollectionsNum',
          collectionsNum: res.total
        })
      }
    } catch (error) {
      console.log('获取收藏报错了', error)
    }
    setBistLoading(false)
  }

  const itemActions = (item: API.BlogInfo) => {
    const arr = [
      <IconText
        key='list-vertical-user'
        icon={UserOutlined}
        text={<NavLink to={`/account/center/${item.createdId}`}>{item.createdName}</NavLink>}
      />,
      <IconText
        key='list-vertical-date'
        icon={ClockCircleOutlined}
        text={formatTime(item.approvedDate)}
      />,
      <IconText icon={EyeOutlined} text={item.reads} key='list-vertical-message' />
    ]

    return arr
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

  return (
    <BlogListSkeleton split rows={1} className={styles.skeleton} loading={firstEnter}>
      <List
        size='large'
        loading={listLoading}
        itemLayout='vertical'
        pagination={{
          ...collectionData.pagination,
          itemRender,
          onChange: getBlogCollectList
        }}
        className={styles.blogList}
        dataSource={collectionData?.list}
        renderItem={item => (
          <List.Item key={item.id} actions={itemActions(item)}>
            <List.Item.Meta title={<BlogTitle isMe={isMe} initList={initList} blogInfo={item} />} />
            {item.status === 'DELETED' && (
              <div className='collection-expired'>
                <FormattedMessage id='pages.account.expired' defaultMessage='已失效' />
              </div>
            )}
          </List.Item>
        )}
      />
    </BlogListSkeleton>
  )
}

export default connect()(Articles)
