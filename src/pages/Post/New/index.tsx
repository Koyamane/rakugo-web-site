/*
 * @Author: dingyun
 * @Date: 2021-12-22 11:12:27
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-05 18:41:00
 * @Description:
 */

import { AvatarDropdown } from '@/components'
import { debounce } from '@/utils/tools'
import { SwapOutlined } from '@ant-design/icons'
import { PageLoading } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Helmet, history, Outlet, useIntl, useModel, useParams } from '@umijs/max'
import { Avatar, Input, Modal, Popover } from 'antd'
import mediumZoom, { Zoom } from 'medium-zoom'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Page404 from '../../Exception/404'
import { BlogInfoApi } from '../Article/services'
import PostDrawer from './components/PostDrawer'
import { AddBlogType } from './data'

let curZoom: Zoom

export default (): React.ReactNode => {
  const intl = useIntl()
  const [is404, setIs404] = useState(false)
  const [modal, contextHolder] = Modal.useModal()
  const [titleValue, setTitleValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [blogInfo, setBlogInfo] = useState<API.BlogInfo>()
  const { initialState } = useModel('@@initialState')
  const { id } = useParams<{ id: string }>()
  const { getDataDictionary } = useModel('useDataDictionary')
  const editor = useMemo<AddBlogType['editor']>(() => {
    const str = location.pathname.substring(6, 8)
    if (str === 'rt') return 'RICH_TEXT'
    return 'MARKDOWN'
  }, [location.pathname])

  const switchTo = useMemo(() => {
    if (editor === 'MARKDOWN') {
      return intl.formatMessage({ id: 'pages.post.switchToRichText' })
    }
    return intl.formatMessage({ id: 'pages.post.switchToMarkdown' })
  }, [editor, intl.locale])

  const { leavePage, mainText, setMainText, initFileList, setContentFileArr } =
    useModel('useArticle')

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value)
  }

  const changeEditor = () => {
    modal.confirm({
      title: switchTo,
      content: intl.formatMessage({ id: 'pages.post.switchToHint' }),
      onOk() {
        setMainText('')
        // 清空已有文件地址
        setContentFileArr([])
        const url = editor === 'RICH_TEXT' ? '/post/md' : '/post/rt'
        history.replace(id ? `${url}/${id}` : url)
      }
    })
  }

  const getBlogInfo = async () => {
    if (!id) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data: API.BlogInfo = await BlogInfoApi(id)
      if (data.createdId !== initialState?.currentUser?.userId) {
        // 不是自己的单，不能进入编辑页面
        const error: any = new Error()
        error.info = { errorCode: 404 }
        throw error
      }

      setMainText(data.content)
      setTitleValue(data.title)
      setBlogInfo(data)
    } catch (error: any) {
      setTitleValue('')
      setBlogInfo(undefined)
      console.log(error)
      if (error?.info?.errorCode === 404) setIs404(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    getDataDictionary(['ARTICLE_SORT'])
    getBlogInfo()

    // 关闭、刷新页面前执行
    window.addEventListener('beforeunload', leavePage)

    // 离开路由时执行
    return () => {
      leavePage()
      window.removeEventListener('beforeunload', leavePage)
    }
  }, [])

  useLayoutEffect(() => {
    if (blogInfo) {
      const fileNodeArr = document.querySelectorAll('.post-article-editor img')
      const urlArr: string[] = []
      fileNodeArr.length &&
        fileNodeArr.forEach((item: any) => {
          urlArr.push(item.getAttribute('src') || '')
        })
      // 初始化已有文件地址
      initFileList([...urlArr])
    }
  }, [blogInfo])

  useLayoutEffect(() => {
    debounce(() => {
      if (!curZoom) {
        curZoom = mediumZoom('.post-article-editor img')
      } else {
        curZoom.attach('.post-article-editor img')
      }
    }, 300)()
  }, [mainText])

  // 因为路由 layout false 会导致用不了 token，所以只能采取覆盖的方式
  const postArticleClassName = useEmotionCss(({ token }) => ({
    width: '100%',
    height: '100%',
    color: token.colorText,
    background: token.colorBgContainer,

    '.post-article-layout': {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: is404 ? 'center' : 'initial',
      marginInline: editor === 'RICH_TEXT' ? 'auto' : '0',
      maxWidth: editor === 'RICH_TEXT' ? (token as any).pageMaxWidth : 'auto'
    },

    '.post-article': {
      '&-header': {
        flexShrink: '0',
        display: 'flex',
        alignItems: 'center',
        color: token.colorTextDescription,
        justifyContent: 'space-between',
        paddingBlock: token.paddingSM,
        paddingInline: token.paddingXL,
        fontSize: token.fontSizeHeading3,
        background: token.colorBgContainer,

        '&-title': {
          padding: 0,
          flex: '1',
          marginInlineEnd: token.marginSM,
          fontSize: token.fontSizeHeading3
        },

        '&-change-editor': {
          cursor: 'pointer',
          marginInline: token.marginSM
        },

        '&-avatar': {
          cursor: 'pointer',
          flexShrink: '0'
        }
      },

      '&-editor': {
        flex: '1',
        overflow: 'hidden',

        '& > div': {
          height: '100%',
          '.bytemd': {
            height: '100%'
          }
        },

        '.CodeMirror': {
          background: token.colorBgLayout
        },

        '.quill': {
          width: '800px',
          marginInline: 'auto',
          '.ql-snow': {
            border: 'none',
            fontSize: token.fontSizeLG
          },
          '.ql-container': {
            height: 'calc(100% - 70px)'
          }
        },

        [`@media screen and (max-width: ${token.screenLG}px)`]: {
          '.quill': {
            width: '100%'
          }
        }
      }
    },

    [`@media screen and (max-width: ${token.screenMD}px)`]: {
      '.post-article-header': {
        paddingInline: token.paddingMD
      }
    }
  }))

  if (loading) return <PageLoading />

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'menu.post.article' })} -{' '}
          {intl.formatMessage({ id: 'pages.layouts.site.title' })}
        </title>
      </Helmet>

      <main className={postArticleClassName + ' post-article'}>
        {contextHolder}
        <div className='post-article-layout'>
          {is404 ? (
            <Page404 />
          ) : (
            <>
              <header className='post-article-header'>
                <Input
                  bordered={false}
                  value={titleValue}
                  onChange={titleChange}
                  className='post-article-header-title'
                  placeholder={intl.formatMessage({ id: 'pages.post.titlePlaceholder' })}
                />

                <>
                  <PostDrawer editor={editor} blogInfo={blogInfo} titleValue={titleValue} />
                  <Popover content={switchTo} placement='bottomRight'>
                    <SwapOutlined
                      onClick={changeEditor}
                      className='post-article-header-change-editor'
                    />
                  </Popover>
                  <AvatarDropdown menu>
                    <Avatar
                      src={initialState?.currentUser?.avatar}
                      className='post-article-header-avatar'
                    />
                  </AvatarDropdown>
                </>
              </header>

              <div className='post-article-editor'>
                <Outlet />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
