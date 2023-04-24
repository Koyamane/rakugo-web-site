/*
 * @Author: dingyun
 * @Date: 2023-04-14 17:17:48
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-24 15:26:52
 * @Description:
 */
import frontmatter from '@bytemd/plugin-frontmatter' // 解析前题
import gemoji from '@bytemd/plugin-gemoji' // emoji
import highlight from '@bytemd/plugin-highlight' // 代码高亮
import math from '@bytemd/plugin-math' // 数学公式
import mermaid from '@bytemd/plugin-mermaid' // 流程图等
import { Viewer } from '@bytemd/react'
import { useModel } from '@umijs/max'
import 'bytemd/dist/index.min.css' // bytemd基础样式必须引入！！！
import 'highlight.js/styles/atom-one-light.css' // 代码高亮的主题样式(可自选)
import 'juejin-markdown-themes/dist/juejin.min.css' // 掘金同款样式
import 'katex/dist/katex.css'
import React, { useLayoutEffect } from 'react'

const plugins = [
  gemoji(), // Gemoji短代码
  mermaid(),
  frontmatter(), // 解析前题
  highlight(), // 代码高亮
  math()
]

interface MarkdownItemProps {
  value: string
}

const MarkdownItem: React.FC<MarkdownItemProps> = React.memo(({ value }) => {
  const { getDirectoryList } = useModel('useArticle')

  useLayoutEffect(() => {
    getDirectoryList('#article-layout-content-detail')
  }, [])

  return <Viewer value={value} plugins={plugins} />
})

export default MarkdownItem
