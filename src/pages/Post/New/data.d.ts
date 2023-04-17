/*
 * @Author: dingyun
 * @Date: 2021-12-25 16:34:33
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-22 12:06:26
 * @Description:
 */

export type AddBlogType = Partial<API.BlogInfo> & { title: API.BlogInfo['title'] }

export interface RichTextEditorProps {
  value: EditorState
  htmlChange: (value: string) => void
  onChange: (value: EditorState) => void
  onFileChange: (value: string) => void
  contentFileChange: (value: string[]) => void
}

export interface MarkdownEditorProps {
  mdValue: string
  locale: string
  mdChange: (value: string) => void
  htmlChange: (value: string) => void
}
