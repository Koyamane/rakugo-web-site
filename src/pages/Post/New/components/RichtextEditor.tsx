/*
 * @Author: dingyun
 * @Date: 2023-04-17 17:50:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-24 16:29:33
 * @Description:
 */
import { useVerifyFileSize } from '@/hooks'
import { UploadFile } from '@/services/global'
import { useIntl, useModel } from '@umijs/max'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

const Icons = Quill.import('ui/icons')
// 这里的key和上面定义一致
Icons['code-block'] =
  "<svg focusable='false' aria-hidden='true' viewBox='0 0 1024 1024' width='1.3em' height='1em' fill='#444'><path d='M158.165333 499.498667A42.496 42.496 0 0 0 170.666667 469.333333V256a42.666667 42.666667 0 0 1 42.666666-42.666667 42.666667 42.666667 0 0 0 0-85.333333C142.762667 128 85.333333 185.429333 85.333333 256v195.669333l-30.165333 30.165334a42.666667 42.666667 0 0 0 0 60.330666l30.165333 30.165334V768c0 70.570667 57.429333 128 128 128a42.666667 42.666667 0 0 0 0-85.333333 42.666667 42.666667 0 0 1-42.666666-42.666667v-213.333333a42.496 42.496 0 0 0-12.501334-30.165334L145.664 512l12.501333-12.501333zM978.090667 495.658667a42.709333 42.709333 0 0 0-9.258667-13.824L938.666667 451.669333V256c0-70.570667-57.429333-128-128-128a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 1 42.666666 42.666667v213.333333a42.581333 42.581333 0 0 0 12.501334 30.165334l12.501333 12.501333-12.501333 12.501333A42.496 42.496 0 0 0 853.333333 554.666667v213.333333a42.666667 42.666667 0 0 1-42.666666 42.666667 42.666667 42.666667 0 1 0 0 85.333333c70.570667 0 128-57.429333 128-128v-195.669333l30.165333-30.165334a42.709333 42.709333 0 0 0 9.258667-46.506666zM669.738667 225.450667a42.752 42.752 0 0 0-69.546667 14.762666l-255.829333 512a42.624 42.624 0 0 0 23.893333 55.424 42.922667 42.922667 0 0 0 55.552-23.765333l255.786667-512a42.538667 42.538667 0 0 0-9.813334-46.421333z'></path></svg>"
Icons.header['3'] =
  "<svg focusable='false' aria-hidden='true' viewBox='0 0 1024 1024' width='1.2em' height='1em' fill='#444'><path d='M88 448h400V172c0-24.3 19.7-44 44-44s44 19.7 44 44v680c0 24.3-19.7 44-44 44s-44-19.7-44-44V536H88v316c0 24.3-19.7 44-44 44S0 876.3 0 852V172c0-24.3 19.7-44 44-44s44 19.7 44 44v276zM815.551 597.802c13.128 0.47 26.257-0.469 39.385-2.813 13.129-2.344 24.85-6.447 35.165-12.308 10.316-5.86 18.638-13.948 24.968-24.263 6.33-10.315 9.494-22.975 9.494-37.978 0-21.1-7.15-37.978-21.45-50.638-14.301-12.66-32.704-18.989-55.21-18.989-14.066 0-26.257 2.813-36.572 8.44-10.315 5.626-18.872 13.245-25.67 22.857-6.799 9.612-11.84 20.395-15.121 32.352-3.283 11.956-4.69 24.263-4.22 36.923h-80.177c0.938-23.913 5.392-46.066 13.363-66.462 7.97-20.396 18.872-38.095 32.703-53.099 13.832-15.004 30.594-26.725 50.287-35.165C802.188 388.22 824.459 384 849.31 384c19.223 0 38.095 2.813 56.616 8.44 18.52 5.626 35.165 13.831 49.934 24.615 14.77 10.784 26.609 24.498 35.517 41.143 8.909 16.645 13.363 35.75 13.363 57.318 0 24.85-5.626 46.535-16.88 65.055-11.252 18.52-28.835 32-52.747 40.44v1.407c28.132 5.626 50.052 19.575 65.759 41.846 15.707 22.27 23.56 49.348 23.56 81.23 0 23.444-4.688 44.425-14.065 62.946-9.378 18.52-22.037 34.227-37.979 47.12-15.942 12.894-34.462 22.858-55.561 29.89-21.1 7.034-43.37 10.55-66.814 10.55-28.601 0-53.568-4.103-74.902-12.308-21.334-8.205-39.15-19.81-53.451-34.813-14.3-15.004-25.202-33.055-32.704-54.154-7.502-21.099-11.487-44.542-11.956-70.33h80.177c-0.938 30.008 6.447 54.975 22.154 74.902s39.268 29.89 70.682 29.89c26.726 0 49.114-7.62 67.166-22.857 18.051-15.239 27.077-36.923 27.077-65.055 0-19.224-3.751-34.462-11.253-45.715-7.502-11.252-17.348-19.81-29.539-25.67-12.19-5.86-25.905-9.494-41.143-10.901-15.239-1.407-30.828-1.875-46.77-1.407v-59.78z'></path></svg>"

const ReactQuillEditor: React.FC = () => {
  const intl = useIntl()
  const [isShow, setIsShow] = useState(false)
  const [value, setValue] = useState('')
  const quillRef = useRef<ReactQuill>()
  const { verifyOneFileSize } = useVerifyFileSize('one', 10)
  const { mainText, addFileList, onMainTextChange } = useModel('useArticle')

  const imageHandler = async () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      const { files } = input
      if (!files) return
      if (!files.length) return
      if (!verifyOneFileSize(files[0])) return

      try {
        const url = await UploadFile(files[0], 'blog/content/')
        addFileList([url])
        const quill = quillRef?.current?.getEditor() // 获取到编辑器本身
        const cursorPosition = quill?.getSelection()?.index || 0 // 获取当前光标位置
        quill?.insertEmbed(cursorPosition, 'image', url) // 插入图片
        quill?.setSelection((cursorPosition + 1) as any) // 光标位置加 1
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 禁止粘贴图片
  const handleImgMatcher = (node: Element, delta: any) => {
    const quill = quillRef?.current?.getEditor() // 获取到编辑器本身
    if (quill?.getSelection() === undefined) {
      // 为 undefined 时，是第一次进入，就是编辑时赋值，其它时候为 null
      return delta
    }
    delta.ops = []
    return delta
  }

  const modules = useMemo(() => {
    return {
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value
      },
      toolbar: {
        container: [
          ['bold'],
          ['italic'],
          ['underline'],
          ['strike'],
          [{ header: 1 }],
          [{ header: 2 }],
          [{ header: 3 }],
          ['blockquote'],
          ['code-block'],
          ['code'],
          [{ list: 'ordered' }],
          [{ list: 'bullet' }],
          ['link'],
          ['image']
        ],

        handlers: {
          image: imageHandler
        }
      },
      clipboard: {
        matchers: [['IMG', handleImgMatcher]]
      }
    }
  }, [])

  const onChange = (value2: string) => {
    setValue(value2)
    onMainTextChange(value2)
  }

  useEffect(() => {
    // 这西巴 ReactQuill 会有缓存的，必须先注销再渲染
    setTimeout(() => {
      setIsShow(true)
    })

    return () => {
      setIsShow(false)
    }
  }, [])

  return (
    <>
      {isShow && (
        <ReactQuill
          theme='snow'
          modules={modules}
          onChange={onChange}
          ref={quillRef as any}
          value={value || mainText}
          placeholder={intl.formatMessage({ id: 'pages.post.textPlaceholder' })}
        />
      )}
    </>
  )
}

export default ReactQuillEditor
