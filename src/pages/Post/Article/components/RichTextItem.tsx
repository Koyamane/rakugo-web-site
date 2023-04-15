/*
 * @Author: dingyun
 * @Date: 2023-04-14 17:17:48
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-15 11:21:14
 * @Description:
 */
import { useModel } from '@umijs/max'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import React, { useLayoutEffect, useMemo } from 'react'

interface MarkdownItemProps {
  value: string
}

const RichTextItem: React.FC<MarkdownItemProps> = React.memo(({ value }) => {
  const { getDirectoryList } = useModel('useArticle')
  const richData = useMemo(() => {
    return BraftEditor.createEditorState(value)
  }, [value])

  useLayoutEffect(() => {
    getDirectoryList('#article-layout-content-detail')
  }, [])

  return <BraftEditor readOnly controls={[]} value={richData} />
})

export default RichTextItem
