/*
 * @Author: dingyun
 * @Date: 2021-12-22 11:12:27
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-17 10:20:12
 * @Description:
 */

import { AvatarDropdown } from '@/components'
import { SwapOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useModel } from '@umijs/max'
import { Avatar, Button, Input, Modal, Popover } from 'antd'
import React, { useState } from 'react'
import MarkdownEditor from './components/MarkdownEditor'
import RichtextEditor from './components/RichtextEditor'
import { AddBlogType } from './data'

export default (): React.ReactNode => {
  const { initialState } = useModel('@@initialState')
  const [mdValue, setMdValue] = useState('')
  const [modal, contextHolder] = Modal.useModal()
  const [editor, setEditor] = useState<AddBlogType['editor']>('MARKDOWN')

  const changeEditor = () => {
    modal.confirm({
      title: '切换编辑器',
      content: '切换后数据不会保留，确定要切换吗？',
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
      marginInline: editor === 'MARKDOWN' ? 'auto' : '0',
      maxWidth: editor === 'MARKDOWN' ? (token as any).pageMaxWidth : 'auto'
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
            placeholder='请输入文章标题……'
            className='post-article-header-title'
          />

          <>
            <Button type='primary'>发布</Button>
            <Popover content='切换编辑器'>
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
          {editor === 'RICH_TEXT' ? (
            <MarkdownEditor value={mdValue} onChange={setMdValue} />
          ) : (
            <RichtextEditor />
          )}
        </div>
      </div>
    </main>
  )
}
