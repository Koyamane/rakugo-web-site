/*
 * @Author: dingyun
 * @Date: 2023-04-14 17:17:48
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 21:37:56
 * @Description:
 */
import { Viewer } from '@bytemd/react'
import { useModel } from '@umijs/max'
import 'bytemd/dist/index.min.css' // bytemd基础样式必须引入！！！
import 'juejin-markdown-themes/dist/juejin.min.css' // 掘金同款样式
import React, { useLayoutEffect } from 'react'

interface MarkdownItemProps {
  value: string
}

const MarkdownItem: React.FC<MarkdownItemProps> = React.memo(({ value }) => {
  const { getDirectoryList } = useModel('useArticle')

  useLayoutEffect(() => {
    getDirectoryList('#article-layout-content-detail')
  }, [])

  return <Viewer value={value} />
})

export default MarkdownItem
