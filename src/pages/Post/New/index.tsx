/*
 * @Author: dingyun
 * @Date: 2021-12-22 11:12:27
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-23 16:50:50
 * @Description:
 */

import { AvatarDropdown } from '@/components'
import { DeleteFile } from '@/services/global'
import { debounce } from '@/utils/tools'
import { SwapOutlined } from '@ant-design/icons'
import { PageLoading } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Helmet, useIntl, useModel, useParams } from '@umijs/max'
import { Avatar, Input, Modal, Popover } from 'antd'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Settings from '../../../../config/defaultSettings'
import { BlogInfoApi } from '../Article/services'
import MarkdownEditor from './components/MarkdownEditor'
import PostDrawer from './components/PostDrawer'
import RichtextEditor from './components/RichtextEditor'
import { AddBlogType } from './data'

// 这些数据不需要及时刷新组件，所以写外面
// 已有的文件对象，比如编辑时的
let existingFileList: string[] = []
// 新增的文件对象
let newFileList: string[] = []
// 现存的文件
let contentFileArr: string[] = []
// 是否全删除图片，没发布直接退出需要全删
let isAllDelete = true

export default (): React.ReactNode => {
  const intl = useIntl()
  const [mainText, setMainText] = useState('')
  const [modal, contextHolder] = Modal.useModal()
  const [titleValue, setTitleValue] = useState('')
  const [loading, setLoading] = useState(true)
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

  const setIsAllDelete = (flag: boolean) => {
    isAllDelete = flag
  }

  /**
   * @description 存储上传的文件地址
   * @param fileUrl 新增的文件地址数组
   */
  const addFileList = (fileUrl: string[]) => {
    existingFileList = [...existingFileList, ...fileUrl]
    newFileList = [...newFileList, ...fileUrl]
  }

  /**
   * @description 重置图片相关数据
   */
  const resetImgData = () => {
    newFileList = []
    isAllDelete = true
    contentFileArr = []
    existingFileList = []
  }

  // 关闭、刷新页面时要做的事
  const leavePage = () => {
    // 没传不用处理
    if (!existingFileList.length) return

    // 没发布直接退出页面时
    if (isAllDelete) {
      // 如果传了，需要删除新上传的
      newFileList.length && DeleteFile(newFileList)
      resetImgData()
      return
    }

    if (existingFileList.length !== contentFileArr.length) {
      const deleteImgArr = existingFileList.filter(item => {
        return !contentFileArr.find(item2 => item === item2)
      })

      deleteImgArr.length && DeleteFile(deleteImgArr)
    }

    resetImgData()
  }

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
        // 清空已有文件地址
        contentFileArr = []
      }
    })
  }

  const getBlogInfo = async () => {
    if (!id) {
      setEditor('MARKDOWN')
      setLoading(false)
      return
    }
    setLoading(true)
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
    setLoading(false)
  }

  const onMainTextChange = (value: string) => {
    setMainText(value)
    debounce(() => {
      const fileNodeArr = document.querySelectorAll('.post-article-editor img')
      const urlArr: string[] = []
      fileNodeArr.length &&
        fileNodeArr.forEach((item: any) => {
          urlArr.push(item.getAttribute('src') || '')
        })
      // 赋值已有文件地址
      contentFileArr = [...urlArr]
    }, 400)()
  }

  useEffect(() => {
    // 因为存在博文调博文的情况
    getBlogInfo()
  }, [id])

  useEffect(() => {
    getDataDictionary(['ARTICLE_SORT'])

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
      existingFileList = [...urlArr]
      contentFileArr = [...urlArr]
    }
  }, [blogInfo])

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

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'menu.post.article' })} - {Settings.title}
        </title>
      </Helmet>

      {loading ? (
        <PageLoading />
      ) : (
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
                  editor={editor}
                  mainText={mainText}
                  blogInfo={blogInfo}
                  titleValue={titleValue}
                  setIsAllDelete={setIsAllDelete}
                />
                <Popover content={switchTo}>
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
              {editor === 'MARKDOWN' && (
                <MarkdownEditor
                  value={mainText}
                  onChange={onMainTextChange}
                  onFileChange={addFileList}
                />
              )}
              {editor === 'RICH_TEXT' && (
                <RichtextEditor
                  value={mainText}
                  onChange={onMainTextChange}
                  onFileChange={addFileList}
                />
              )}
            </div>
          </div>
        </main>
      )}
    </>
  )
}
