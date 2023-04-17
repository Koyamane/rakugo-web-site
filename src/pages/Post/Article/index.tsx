/*
 * @Author: dingyun
 * @Date: 2021-12-22 11:12:27
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-15 18:56:16
 * @Description:
 */
import { BackTop, Comment, DirectoryAnchor, FollowButton, FooterBar } from '@/components'
import IconText from '@/components/IconText'
import useFormatTime from '@/hooks/useFormatTime'
import { EyeOutlined, TagsOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, NavLink, useModel, useParams } from '@umijs/max'
import { Avatar, Space, Spin } from 'antd'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import ArticleFooterUser from './components/ArticleFooterUser'
import ArticleOperationBtn from './components/ArticleOperationBtn'
import MarkdownItem from './components/MarkdownItem'
import RichTextItem from './components/RichTextItem'
import { BlogInfoApi, BlogSimplePageApi } from './services'

const ReaderValue = ({ editor, value }: { editor: API.BlogInfo['editor']; value: string }) =>
  editor === 'RICH_TEXT' ? <RichTextItem value={value} /> : <MarkdownItem value={value} />

export default (): React.ReactNode => {
  const { id } = useParams<{ id: string }>()
  const { initialState } = useModel('@@initialState')
  const userId = initialState?.currentUser?.userId
  const { setTo404 } = useModel('use404Model')
  const { followed, setFollowed, directoryList } = useModel('useArticle')
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
        flexShrink: '0',
        position: 'sticky',
        top: '50%',
        display: 'flex',
        gap: token.marginMD,
        flexDirection: 'column',
        transform: 'translateY(-50%)',
        marginInlineEnd: token.marginXL,

        button: {
          border: 'none',
          boxShadow: token.boxShadow,

          '&.ant-btn-default': {
            color: token.colorTextDescription
          }
        }
      },

      '.article-layout-content': {
        flex: '1',
        overflow: 'hidden',
        paddingInline: token.paddingLG,
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
              },

              '&-data-tags': {
                wordBreak: 'break-all'
              }
            }
          },

          '&-cover': {
            width: '100%',
            marginBlockStart: token.marginMD
          }
        },

        '&-detail': {
          overflow: 'hidden',
          '.markdown-body': {
            color: token.colorText
          },
          '.ql-editor': {
            padding: '0'
          }
        }
      },

      '.article-layout-right': {
        width: '300px',
        marginInlineStart: token.marginMD,

        '&-user': {
          padding: token.paddingMD,
          marginBlockEnd: token.marginMD,
          borderRadius: token.borderRadius,
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
        '.article-layout-right, .article-layout-left': {
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

        if (res?.createdId) {
          const data = await BlogSimplePageApi({
            dto: { createdId: res.createdId },
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
        if (error?.info?.errorCode === 404) setTo404(true)
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
      {blogInfo && (
        <>
          <div className={articleLayoutClassName}>
            <div className='article-layout-left'>
              <ArticleOperationBtn blogInfo={blogInfo} userId={userId} />
            </div>

            <div className='article-layout-content'>
              <div className='article-layout-content-header'>
                <h1 className='article-layout-content-header-title'>{blogInfo.title}</h1>

                <div className='article-layout-content-header-middle'>
                  <NavLink
                    target='_blank'
                    to={`/account/center/${blogInfo.createdId}`}
                    className='article-layout-content-header-middle-avatar'
                  >
                    <Avatar size={50} src={blogInfo.createdAvatar} />
                  </NavLink>
                  <div className='article-layout-content-header-middle-right'>
                    <NavLink
                      target='_blank'
                      to={`/account/center/${blogInfo.createdId}`}
                      className='article-layout-content-header-middle-right-name'
                    >
                      {blogInfo.createdName}
                    </NavLink>

                    <div className='article-layout-content-header-middle-right-data'>
                      <span>{formatTime(blogInfo.approvedDate)}</span>
                      <IconText
                        icon={EyeOutlined}
                        text={blogInfo.reads}
                        className='article-layout-content-header-middle-right-data-reads'
                      />
                      {blogInfo.tags && !!blogInfo.tags.length && (
                        <IconText
                          align='start'
                          icon={TagsOutlined}
                          text={blogInfo.tags.join('・')}
                          className='article-layout-content-header-middle-right-data-tags'
                        />
                      )}
                    </div>
                  </div>
                </div>

                {blogInfo.cover && (
                  <img
                    src={blogInfo.cover}
                    alt={blogInfo.cover}
                    className='article-layout-content-header-cover'
                  />
                )}
              </div>

              {articleDetail && (
                <div id='article-layout-content-detail' className='article-layout-content-detail'>
                  <ReaderValue editor={blogInfo.editor} value={articleDetail} />
                </div>
              )}

              {blogInfo.status === 'APPROVED' && (
                <Comment targetType='Blog' targetId={blogInfo.id} />
              )}
            </div>

            <div className='article-layout-right'>
              <div className='article-layout-right-user'>
                <div className='article-layout-right-user-info'>
                  <NavLink
                    target='_blank'
                    to={`/account/center/${blogInfo.createdId}`}
                    className='article-layout-right-user-info-avatar'
                  >
                    <Avatar size='large' src={blogInfo.createdAvatar} />
                  </NavLink>
                  <div className='article-layout-right-user-info-right'>
                    <NavLink
                      target='_blank'
                      to={`/account/center/${blogInfo.createdId}`}
                      className='article-layout-right-user-info-right-name'
                    >
                      {blogInfo.createdName}
                    </NavLink>
                    <div className='article-layout-right-user-info-right-signature text-ellipsis'>
                      {blogInfo.createdSignature}
                    </div>
                  </div>
                </div>

                <FollowButton
                  size='middle'
                  shape='default'
                  followedValue={followed}
                  onFollowChange={setFollowed}
                  targetId={blogInfo.createdId}
                  followHintId='pages.account.followTa'
                  className='article-layout-right-user-follow'
                />

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

              {!!directoryList.length && <DirectoryAnchor items={directoryList} />}
            </div>
          </div>

          <FooterBar mobileMode extra={<ArticleFooterUser blogInfo={blogInfo} />}>
            <ArticleOperationBtn mobileMode blogInfo={blogInfo} userId={userId} />
          </FooterBar>
        </>
      )}

      <BackTop />
    </Spin>
  )
}
