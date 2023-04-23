/*
 * @Author: dingyun
 * @Date: 2023-04-14 17:17:48
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-24 00:23:12
 * @Description:
 */
import { useModel } from '@umijs/max'
import React, { useLayoutEffect } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import 'react-quill/dist/quill.bubble.css'

interface MarkdownItemProps {
  value: string
}

const RichTextItem: React.FC<MarkdownItemProps> = React.memo(({ value }) => {
  const { getDirectoryList } = useModel('useArticle')

  useLayoutEffect(() => {
    getDirectoryList('#article-layout-content-detail')
  }, [])

  return (
    <Zoom classDialog='react-medium-image-zoom'>
      <div className='quill'>
        <div className='ql-container ql-bubble'>
          <div className='ql-editor' dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      </div>
    </Zoom>
  )
})

export default RichTextItem
