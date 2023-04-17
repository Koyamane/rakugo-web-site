import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import React, { useMemo, useRef, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Icons = Quill.import('ui/icons')
// 这里的key和上面定义一致
Icons['code-block'] = `<svg
    focusable='false'
    aria-hidden='true'
    viewBox='0 0 1024 1024'
    width='1.2em'
    height='1em'
    fill='currentColor'
  >
    <path d='M158.165333 499.498667A42.496 42.496 0 0 0 170.666667 469.333333V256a42.666667 42.666667 0 0 1 42.666666-42.666667 42.666667 42.666667 0 0 0 0-85.333333C142.762667 128 85.333333 185.429333 85.333333 256v195.669333l-30.165333 30.165334a42.666667 42.666667 0 0 0 0 60.330666l30.165333 30.165334V768c0 70.570667 57.429333 128 128 128a42.666667 42.666667 0 0 0 0-85.333333 42.666667 42.666667 0 0 1-42.666666-42.666667v-213.333333a42.496 42.496 0 0 0-12.501334-30.165334L145.664 512l12.501333-12.501333zM978.090667 495.658667a42.709333 42.709333 0 0 0-9.258667-13.824L938.666667 451.669333V256c0-70.570667-57.429333-128-128-128a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 1 42.666666 42.666667v213.333333a42.581333 42.581333 0 0 0 12.501334 30.165334l12.501333 12.501333-12.501333 12.501333A42.496 42.496 0 0 0 853.333333 554.666667v213.333333a42.666667 42.666667 0 0 1-42.666666 42.666667 42.666667 42.666667 0 1 0 0 85.333333c70.570667 0 128-57.429333 128-128v-195.669333l30.165333-30.165334a42.709333 42.709333 0 0 0 9.258667-46.506666zM669.738667 225.450667a42.752 42.752 0 0 0-69.546667 14.762666l-255.829333 512a42.624 42.624 0 0 0 23.893333 55.424 42.922667 42.922667 0 0 0 55.552-23.765333l255.786667-512a42.538667 42.538667 0 0 0-9.813334-46.421333z'></path>
  </svg>`

const ReactQuillEditor = React.memo(() => {
  const [value, setValue] = useState('')
  const quillRef = useRef<ReactQuill>()

  // 剩下参数 delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor
  const handleChangeValue = (value: string) => {
    // console.log('富文本的值：', value)
    setValue(value)
  }

  const modules = useMemo(() => {
    return {
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value
      },
      toolbar: [
        ['bold'],
        ['italic'],
        ['underline'],
        ['strike'],
        [{ header: 1 }],
        [{ header: 2 }],
        ['blockquote'],
        ['code-block'],
        ['code'],
        [{ list: 'ordered' }],
        [{ list: 'bullet' }],
        ['link'],
        ['image']
      ]
    }
  }, [])

  return (
    <ReactQuill
      ref={quillRef as any}
      placeholder='请输入正文……'
      theme='snow'
      value={value}
      modules={modules}
      onChange={handleChangeValue}
    />
  )
})

export default ReactQuillEditor
