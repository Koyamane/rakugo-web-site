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
import { useIntl, useModel } from '@umijs/max'
import { Avatar, Input, Modal, Popover } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import MarkdownEditor from './components/MarkdownEditor'
import PostDrawer from './components/PostDrawer'
import RichtextEditor from './components/RichtextEditor'
import { AddBlogType } from './data'

export default (): React.ReactNode => {
  const intl = useIntl()
  const [mainText, setMainText] = useState('')
  const [modal, contextHolder] = Modal.useModal()
  const [titleValue, setTitleValue] = useState('')
  const { initialState } = useModel('@@initialState')
  const { getDataDictionary } = useModel('useDataDictionary')
  const [editor, setEditor] = useState<AddBlogType['editor']>('MARKDOWN')
  const switchTo = useMemo(() => {
    if (editor === 'MARKDOWN') {
      return intl.formatMessage({ id: 'pages.post.switchToRichText' })
    }
    return intl.formatMessage({ id: 'pages.post.switchToMarkdown' })
  }, [editor, intl.locale])

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value)
  }

  const changeEditor = () => {
    modal.confirm({
      title: switchTo,
      content: intl.formatMessage({ id: 'pages.post.switchToHint' }),
      onOk() {
        setEditor(editor === 'RICH_TEXT' ? 'MARKDOWN' : 'RICH_TEXT')
      }
    })
  }

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

  useEffect(() => {
    getDataDictionary(['ARTICLE_SORT'])
  }, [])

  return (
    <main className={postArticleClassName + ' post-article'}>
      {contextHolder}
      <div className='post-article-layout'>
        <header className='post-article-header'>
          <Input
            bordered={false}
            onChange={titleChange}
            className='post-article-header-title'
            placeholder={intl.formatMessage({ id: 'pages.post.titlePlaceholder' })}
          />

          <>
            <PostDrawer titleValue={titleValue} mainText={mainText} editor={editor} />
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
          {editor === 'MARKDOWN' ? (
            <MarkdownEditor value={mainText} onChange={setMainText} />
          ) : (
            <RichtextEditor />
          )}
        </div>
      </div>
    </main>
  )
}
