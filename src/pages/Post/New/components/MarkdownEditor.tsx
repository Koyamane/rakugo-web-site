/*
 * @Author: dingyun
 * @Date: 2023-04-16 23:42:11
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-17 14:21:45
 * @Description:
 */
import { FileUploadApi } from '@/services/global'
import frontmatter from '@bytemd/plugin-frontmatter' // 解析前题
import gemoji from '@bytemd/plugin-gemoji' // emoji
import gfm from '@bytemd/plugin-gfm' // 支持 GFM
import gfmZh from '@bytemd/plugin-gfm/locales/zh_Hans.json'
import highlight from '@bytemd/plugin-highlight' // 代码高亮
import math from '@bytemd/plugin-math' // 数学公式
import mathJa from '@bytemd/plugin-math/locales/ja.json'
import mathZh from '@bytemd/plugin-math/locales/zh_Hans.json'
import mermaid from '@bytemd/plugin-mermaid' // 流程图等
import mermaidZh from '@bytemd/plugin-mermaid/locales/zh_Hans.json'
import { Editor } from '@bytemd/react'
import { useIntl } from '@umijs/max'
import 'bytemd/dist/index.min.css' // bytemd基础样式必须引入！！！
import ja from 'bytemd/locales/ja.json' // 中文插件
import zh_Hans from 'bytemd/locales/zh_Hans.json' // 中文插件
import 'highlight.js/styles/routeros.css' // 代码高亮的主题样式(可自选)
import 'juejin-markdown-themes/dist/juejin.min.css' // 掘金同款样式
import React, { useMemo } from 'react'

const gfmJa = {
  strike: '取り消し線',
  strikeText: 'テキスト',
  task: 'タスクリスト',
  taskText: '未処理事項',
  table: 'テーブル',
  tableHeading: 'タイトル'
}

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onFileChange: (value: string[]) => void
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = React.memo(
  ({ value, onChange, onFileChange }) => {
    const intl = useIntl()

    const locale = useMemo(() => {
      const obj: any = {
        'zh-CN': zh_Hans,
        'ja-JP': ja
      }
      return obj[intl.locale]
    }, [intl.locale])

    const plugins = useMemo(() => {
      const mermaidLocale: any = {
        'zh-CN': mermaidZh
      }
      const gfmLocale: any = {
        'zh-CN': gfmZh,
        'ja-JP': gfmJa
      }
      const mathLocale: any = {
        'zh-CN': mathZh,
        'ja-JP': mathJa
      }
      return [
        gfm({ locale: gfmLocale[intl.locale] }), // GFM
        highlight(), // 代码高亮
        frontmatter(), // 解析前题
        gemoji(), // Gemoji短代码
        math({ locale: mathLocale[intl.locale] }),
        mermaid({ locale: mermaidLocale[intl.locale] })
      ]
    }, [intl.locale])

    const onUpload = async (files: File[]) => {
      let arr: { title: string; url: string; alt: string }[] = []

      try {
        const urlArr: string[] = await FileUploadApi(files, 'blog/content/')
        arr = urlArr.map(item => ({
          title: item.replace(/.*\//g, ''),
          url: item,
          alt: item.replace(/.*\//g, '')
        }))
        onFileChange(urlArr)
      } catch (error) {
        console.log(error)
      }

      return arr
    }

    return (
      <Editor
        value={value}
        uploadImages={onUpload}
        locale={locale}
        plugins={plugins}
        onChange={onChange}
      />
    )
  }
)

export default MarkdownEditor
