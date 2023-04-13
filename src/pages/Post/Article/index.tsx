/*
 * @Author: dingyun
 * @Date: 2021-12-22 11:12:27
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 00:12:46
 * @Description:
 */
import IconText from '@/components/IconText'
import useFormatTime from '@/hooks/useFormatTime'
import { EyeOutlined, TagsOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, NavLink, useModel, useParams } from '@umijs/max'
import { Avatar, Button, FloatButton, Space, Spin } from 'antd'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { BlogInfoApi, BlogSimplePageApi } from './services'

export default (): React.ReactNode => {
  const { id } = useParams<{ id: string }>()
  const { initialState } = useModel('@@initialState')
  const userId = initialState?.currentUser?.userId
  const [blogInfo, setBlogInfo] = useState<API.BlogInfo>()
  const [userBlogList, setUserBlogList] = useState<API.BlogInfo[]>([])
  const [loading, setLoading] = useState(true)
  const formatTime = useFormatTime(true)

  const articleLayoutClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      alignItems: 'flex-start',
      color: token.colorText,

      '.article-layout-left': {
        flex: '1',
        overflow: 'hidden',
        padding: token.paddingLG,
        background: token.colorBgContainer,
        borderRadius: token.borderRadius,

        '&-header': {
          paddingBlockEnd: token.paddingMD,

          '&-title': {
            color: token.colorTextHeading,
            fontSize: token.fontSizeHeading2
          },

          '&-middle': {
            display: 'flex',
            alignItems: 'center',

            '&-avatar': {
              flexShrink: '0'
            },

            '&-right': {
              fontSize: token.fontSizeSM,
              color: token.colorTextDescription,
              marginInlineStart: token.marginSM,

              '&-name': {
                color: token.colorText,
                fontSize: token.fontSizeLG,
                marginBlockEnd: token.marginXXS
              },

              '&-data-reads': {
                marginInline: token.marginSM
              }
            }
          },

          '&-cover': {
            width: '100%',
            marginBlockStart: token.marginMD
          }
        },

        '&-detail': {
          overflow: 'hidden'
        }
      },

      '.article-layout-right': {
        position: 'sticky',
        top: token.marginMD,
        flexShrink: '0',
        width: '300px',
        overflow: 'hidden',
        borderRadius: token.borderRadius,
        marginInlineStart: token.marginMD,

        '&-user': {
          padding: token.paddingMD,
          background: token.colorBgContainer,

          '&-info': {
            display: 'flex',
            alignItems: 'center',

            '&-avatar': {
              flexShrink: '0'
            },

            '&-right': {
              overflow: 'hidden',
              fontSize: token.fontSizeSM,
              color: token.colorTextDescription,
              marginInlineStart: token.marginSM,

              '&-name': {
                color: token.colorText,
                fontSize: token.fontSizeLG
              }
            }
          },

          '&-follow': {
            width: '100%',
            marginBlockStart: token.marginMD
          },

          '&-list': {
            marginBlockStart: token.marginMD,
            paddingBlockStart: token.paddingXS,
            borderTop: `1px solid ${token.colorBorderSecondary}`,

            '&-item': {
              marginBlockStart: token.marginSM,

              '&-title': {
                marginBlockEnd: token.marginXXS,

                a: {
                  color: token.colorText,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              },

              '&-actions': {
                fontSize: token.fontSizeSM,
                color: token.colorTextDescription
              }
            }
          }
        }
      },

      // 放后面权重高，所以媒体查询要放后面来
      [`@media screen and (max-width: ${token.screenLG}px)`]: {
        '.article-layout-right': {
          display: 'none'
        }
      }
    }
  })

  const getBlogInfo = async () => {
    setLoading(true)
    if (id) {
      try {
        const res = await BlogInfoApi(id, userId)
        setBlogInfo(res)

        if (userId) {
          const data = await BlogSimplePageApi({
            dto: { createdId: userId },
            pageSize: 5,
            searchMap: {
              id: {
                opt: 'NOT_IN',
                value: id
              }
            }
          })

          setUserBlogList(data.list)
        } else {
          setUserBlogList([])
        }
      } catch (error: any) {
        if (!error.response) return

        // if (error.response && error.response.status === 404) {
        //   setTo404(true)
        // }
      }
    } else {
      setBlogInfo(undefined)
    }
    setLoading(false)
  }

  const articleDetail = useMemo(() => {
    return blogInfo && (blogInfo.mdData || blogInfo.content)
  }, [blogInfo])

  useLayoutEffect(() => {
    getBlogInfo()
  }, [id])

  return (
    <Spin spinning={loading}>
      <div className={articleLayoutClassName}>
        {blogInfo && (
          <>
            <div className='article-layout-left'>
              <div className='article-layout-left-header'>
                <h1 className='article-layout-left-header-title'>{blogInfo.title}</h1>

                <div className='article-layout-left-header-middle'>
                  <NavLink
                    target='_blank'
                    to={`/account/center/${blogInfo.createdId}`}
                    className='article-layout-left-header-middle-avatar'
                  >
                    <Avatar size={50} src={blogInfo.createdAvatar} />
                  </NavLink>
                  <div className='article-layout-left-header-middle-right'>
                    <NavLink
                      target='_blank'
                      to={`/account/center/${blogInfo.createdId}`}
                      className='article-layout-left-header-middle-right-name'
                    >
                      {blogInfo.createdName}
                    </NavLink>

                    <div className='article-layout-left-header-middle-right-data'>
                      <span>{formatTime(blogInfo.approvedDate)}</span>
                      <IconText
                        className='article-layout-left-header-middle-right-data-reads'
                        icon={EyeOutlined}
                        text={blogInfo.reads}
                      />
                      {blogInfo.tags && !!blogInfo.tags.length && (
                        <IconText icon={TagsOutlined} text={blogInfo.tags.join('・')} />
                      )}
                    </div>
                  </div>
                </div>

                {blogInfo.cover && (
                  <img
                    src={blogInfo.cover}
                    alt={blogInfo.cover}
                    className='article-layout-left-header-cover'
                  />
                )}
              </div>

              {articleDetail && (
                <article
                  className='article-layout-left-detail'
                  dangerouslySetInnerHTML={{ __html: articleDetail }}
                />
              )}
            </div>

            <div className='article-layout-right'>
              <div className='article-layout-right-user'>
                <div className='article-layout-right-user-info'>
                  <Avatar
                    size='large'
                    src={blogInfo.createdAvatar}
                    className='article-layout-right-user-info-avatar'
                  />
                  <div className='article-layout-right-user-info-right'>
                    <div className='article-layout-right-user-info-right-name'>
                      {blogInfo.createdName}
                    </div>
                    <div className='article-layout-right-user-info-right-signature text-ellipsis'>
                      {blogInfo.createdSignature}
                    </div>
                  </div>
                </div>

                <Button className='article-layout-right-user-follow'>关注 TA</Button>

                {!!userBlogList.length && (
                  <div className='article-layout-right-user-list'>
                    {userBlogList.map(item => (
                      <div key={item.id} className='article-layout-right-user-list-item'>
                        <div className='article-layout-right-user-list-item-title text-ellipsis'>
                          <NavLink target='_blank' to={`/article/${item.id}`}>
                            {item.title}
                          </NavLink>
                        </div>
                        <Space size='large' className='article-layout-right-user-list-item-actions'>
                          <span>
                            <FormattedMessage id='pages.blog.reads' /> {item.reads}
                          </span>
                          <span>
                            <FormattedMessage id='pages.blog.likes' /> {item.likes}
                          </span>
                        </Space>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <FloatButton.BackTop />
    </Spin>
  )
}
