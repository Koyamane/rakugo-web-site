import BlogListSkeleton from '@/components/BlogListSkeleton'
import IconText from '@/components/IconText'
import useFormatTime from '@/hooks/useFormatTime'
import usePaginationItem from '@/hooks/usePaginationItem'
import { BLOG_STATUS, toObj } from '@/locales/dataDictionary'
import { OperationItem } from '@/pages/Post/Article/data'
import {
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  StarFilled,
  StarOutlined
} from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { connect, Dispatch, NavLink, useIntl, useModel } from '@umijs/max'
import { Divider, Pagination, Popover, Space, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { SomebodyBlogPage } from '../../service'
import OperateItem from './OperateItem'

interface SelfProps {
  dispatch: Dispatch
  isMe?: boolean
  loginUserId?: API.UserInfo['userId']
  userId?: API.UserInfo['userId']
}

const Articles: React.FC<SelfProps> = ({ isMe, loginUserId, userId, dispatch }) => {
  const intl = useIntl()
  const [listLoading, setListLoading] = useState(true)
  const [firstEnter, setFirstEnter] = useState(true)
  const { keyToValue, getDataDictionary } = useModel('useDataDictionary')
  const formatTime = useFormatTime()
  const itemRender = usePaginationItem()
  const [blogData, setBlogData] = useState<{
    list: API.BlogInfo[]
    pagination: { current: number; pageSize: number; total: number }
  }>({
    list: [],
    pagination: { current: 1, pageSize: 10, total: 0 }
  })

  const getBlogList = async (
    current: number = blogData.pagination.current,
    pageSize: number = blogData.pagination.pageSize
  ) => {
    setListLoading(true)
    try {
      const params = {
        dto: {},
        current,
        pageSize
      }

      if (!isMe) {
        // 不是自己的页面，只能看审核通过的东西
        params.dto = { status: 'APPROVED' }
      }

      const res = await SomebodyBlogPage(userId, params)
      if (res) {
        setBlogData({
          list: res.list,
          pagination: {
            current: res.current,
            pageSize: res.pageSize,
            total: res.total
          }
        })
        dispatch({
          type: 'AccountCenter/setArticlesNum',
          articlesNum: res.total
        })
      }
    } catch (error) {
      console.log('获取博客报错了', error)
    }
    setListLoading(false)
  }

  const isIncludeMe = (type: OperationItem['key'], blogDataArr: API.BlogDataItem[]) => {
    if (!loginUserId) return false
    if (!blogDataArr || blogDataArr.length <= 0) return false
    const blogDataObj = blogDataArr[0]

    let flag = false
    switch (type) {
      case 'LIKE':
        flag = blogDataObj.likeArr.includes(loginUserId)
        break
      case 'COLLECT':
        flag = blogDataObj.collectionArr.includes(loginUserId)
        break
      default:
        break
    }
    return flag
  }

  const articleStatus = (item: API.BlogInfo) => {
    return item.status === 'REJECT' ? (
      <Popover
        trigger='hover'
        content={item.rejectReason || '无'}
        title={intl.formatMessage({ id: 'pages.form.rejectReason' })}
      >
        <a>{toObj(BLOG_STATUS)[item.status]}</a>
      </Popover>
    ) : (
      toObj(BLOG_STATUS)[item.status]
    )
  }

  const initList = async () => {
    setFirstEnter(true)
    await getBlogList()
    setFirstEnter(false)
  }

  useEffect(() => {
    getDataDictionary(['ARTICLE_SORT'])
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
      paddingBlock: token.paddingSM,
      justifyContent: 'space-between',
      borderBottom: `1px solid ${token.colorBorderSecondary}`,

      '&-left': {
        flex: '1',
        display: 'flex',
        color: token.colorTextDescription,
        flexDirection: 'column',
        justifyContent: 'space-between',

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
          display: '-webkit-box', // 对象作为伸缩盒子模型展示
          flex: 1,
          overflow: 'hidden',
          color: token.colorText,
          marginBlockEnd: token.marginXXS,
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          WebkitBoxOrient: 'vertical', // 设置或检索伸缩盒子对象的子元素的排列方式
          WebkitLineClamp: '2' // 在第几行上加 ...
        },

        '&-actions': {
          display: 'flex',
          justifyContent: 'space-between',

          '&-active': {
            color: token.colorPrimaryText
          }
        }
      },

      '&-right': {
        flexShrink: 0,
        borderRadius: token.borderRadius,
        overflow: 'hidden',
        position: 'relative',
        width: '180px',
        minHeight: '134px',
        cursor: 'pointer',
        marginInlineStart: token.marginXS,

        '&-cover': {
          borderRadius: token.borderRadius,
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          transform: 'translate(-50%, -50%)'
        }
      }
    },

    '.ant-pagination': {
      textAlign: 'center',
      marginBlock: token.marginMD
    },

    // 放后面权重高，所以媒体查询要放后面来
    [`@media screen and (max-width: ${token.screenMD}px)`]: {
      '.content-list-item': {
        flexDirection: 'column-reverse',

        '&-right': {
          marginInline: 'auto',
          marginBlockEnd: token.marginSM
        }
      }
    }
  }))

  return (
    <BlogListSkeleton split loading={firstEnter} className={skeletonClassName}>
      <Spin spinning={listLoading}>
        <div className={contentListClassName}>
          {blogData.list.map(item => (
            <div key={item.id} className='content-list-item'>
              <div className='content-list-item-left'>
                <div className='content-list-item-left-userInfo'>
                  {formatTime(item.approvedDate)}
                  <Divider type='vertical' />
                  {keyToValue('ARTICLE_SORT', item.sort) + '・'}
                  {!!item.tags.length && item.tags.join('・')}
                </div>
                <div className='content-list-item-left-title text-ellipsis'>
                  <NavLink target='_blank' to={`/article/${item.id}`}>
                    {item.title}
                  </NavLink>
                </div>

                <div className='content-list-item-left-body'>{item.summary}</div>

                <div className='content-list-item-left-actions'>
                  <Space size='middle'>
                    {isMe && <span>{articleStatus(item)}</span>}
                    <IconText icon={EyeOutlined} text={item.reads} />
                    <IconText
                      text={item.likes}
                      icon={isIncludeMe('LIKE', item.blogDataArr) ? LikeFilled : LikeOutlined}
                      className={`${
                        isIncludeMe('LIKE', item.blogDataArr) &&
                        'content-list-item-left-actions-active'
                      }`}
                    />
                    <IconText
                      text={item.collections}
                      icon={isIncludeMe('COLLECT', item.blogDataArr) ? StarFilled : StarOutlined}
                      className={`${
                        isIncludeMe('COLLECT', item.blogDataArr) &&
                        'content-list-item-left-actions-active'
                      }`}
                    />
                    <IconText text={item.comments} icon={MessageOutlined} />
                  </Space>

                  {isMe && <OperateItem blogInfo={item} onDeleted={getBlogList} />}
                </div>
              </div>
              {item.cover && (
                <NavLink
                  target='_blank'
                  className='content-list-item-right'
                  to={`/article/${item.id}`}
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className='content-list-item-right-cover'
                  />
                </NavLink>
              )}
            </div>
          ))}

          <Pagination
            showSizeChanger
            showQuickJumper
            itemRender={itemRender}
            onChange={getBlogList}
            {...blogData.pagination}
          />
        </div>
      </Spin>
    </BlogListSkeleton>
  )
}

export default connect()(Articles)
