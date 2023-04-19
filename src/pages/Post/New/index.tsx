/*
 * @Author: dingyun
 * @Date: 2021-12-22 11:12:27
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 23:08:04
 * @Description:
 */

import { AvatarDropdown } from '@/components'
import { SwapOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl, useModel, useParams } from '@umijs/max'
import { Avatar, Input, Modal, Popover } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { BlogInfoApi } from '../Article/services'
import MarkdownEditor from './components/MarkdownEditor'
import PostDrawer from './components/PostDrawer'
import RichtextEditor from './components/RichtextEditor'
import { AddBlogType } from './data'

// 这些数据不需要及时刷新组件，所以写外面
// 已有的文件对象，比如编辑时的
// let existingFileList: string[] = []
// // 新增的文件对象
// let newFileList: string[] = []
// // 富文本内的文件
// let contentFileArr: string[] = []
// // 是否全删除图片，没发布直接退出需要全删
// let isAllDelete = true

export default (): React.ReactNode => {
  const intl = useIntl()
  const [mainText, setMainText] = useState('')
  const [modal, contextHolder] = Modal.useModal()
  const [titleValue, setTitleValue] = useState('')
  const [blogInfo, setBlogInfo] = useState<API.BlogInfo>()
  const { initialState } = useModel('@@initialState')
  const { id } = useParams<{ id: string }>()
  const { getDataDictionary } = useModel('useDataDictionary')
  const [editor, setEditor] = useState<AddBlogType['editor']>()
  const switchTo = useMemo(() => {
    if (editor === 'MARKDOWN') {
      return intl.formatMessage({ id: 'pages.post.switchToRichText' })
    }
    return intl.formatMessage({ id: 'pages.post.switchToMarkdown' })
  }, [editor, intl.locale])

  /**
   * @description 存储上传的文件地址
   * @param fileUrl 新增的文件地址
   */
  // const addFileList = (fileUrl: string) => {
  //   existingFileList = [...existingFileList, fileUrl]
  //   newFileList = [...newFileList, fileUrl]
  // }

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value)
  }

  const changeEditor = () => {
    modal.confirm({
      title: switchTo,
      content: intl.formatMessage({ id: 'pages.post.switchToHint' }),
      onOk() {
        setEditor(editor === 'RICH_TEXT' ? 'MARKDOWN' : 'RICH_TEXT')
        setMainText('')
      }
    })
  }

  const getBlogInfo = async () => {
    if (!id) {
      setEditor('MARKDOWN')
      return
    }

    try {
      const data: API.BlogInfo = await BlogInfoApi(id)
      setMainText(data.content)
      setEditor(data.editor)
      setTitleValue(data.title)
      setBlogInfo(data)
    } catch (error) {
      setMainText('')
      setEditor('MARKDOWN')
      setTitleValue('')
      setBlogInfo(undefined)
      console.log(error)
    }

    // 获取博文内容后，要初始化 uploadImgList、contentImgArr
    // const fileNodeArr = document.querySelectorAll('.bf-content img, .bf-content .bf-url')
    // const urlArr: string[] = []
    // fileNodeArr.length &&
    //   fileNodeArr.forEach((item: any) => {
    //     if (item.tagName.toLowerCase() === 'img') {
    //       urlArr.push(item.getAttribute('src') || '')
    //     } else {
    //       urlArr.push(item.innerText || '')
    //     }
    //   })
    // existingFileList = [...urlArr]
    // contentFileArr = [...urlArr]
  }

  useEffect(() => {
    // 因为存在博文调博文的情况
    getBlogInfo()
  }, [id])

  useEffect(() => {
    getDataDictionary(['ARTICLE_SORT'])

    // window.onbeforeunload= () => {
    //   console.log(11111111)

    //   return 'aaaaaaaaaaa'
    // }
    // window.addEventListener('unload', () => {
    //   console.log(222222222222222)
    // })
  }, [])

  // 因为路由 layout false 会导致用不了 token，所以只能采取覆盖的方式
  const postArticleClassName = useEmotionCss(({ token }) => ({
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    color: token.colorText,
    zIndex: token.zIndexPopupBase,
    background: token.colorBgContainer,

    '.post-article-layout': {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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
    }
  }))

  return (
    <main className={postArticleClassName + ' post-article'}>
      {contextHolder}
      <div className='post-article-layout'>
        <header className='post-article-header'>
          <Input
            bordered={false}
            value={titleValue}
            onChange={titleChange}
            className='post-article-header-title'
            placeholder={intl.formatMessage({ id: 'pages.post.titlePlaceholder' })}
          />

          <>
            <PostDrawer
              titleValue={titleValue}
              mainText={mainText}
              editor={editor}
              blogInfo={blogInfo}
            />
            <Popover content={switchTo}>
              <SwapOutlined onClick={changeEditor} className='post-article-header-change-editor' />
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
          {editor === 'MARKDOWN' && <MarkdownEditor value={mainText} onChange={setMainText} />}
          {editor === 'RICH_TEXT' && <RichtextEditor value={mainText} onChange={setMainText} />}
        </div>
      </div>
    </main>
  )
}
