import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Button, Input, message, Upload } from 'antd'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useIntl } from 'umi'

interface InputUploadProps {
  // onChange 是自定义组件必须的
  onChange?: (value: any) => void
  value?: any

  afterText?: string
  placeholder?: string

  className?: string // class 类名
  fileType?: 'IMAGE' | 'AUDIO' | 'VIDEO' // 文件类型
  typeArr?: string[] // 自定义校验类型 例如：['.xls', '.xlsx']
  fileSize?: number // 文件大小 默认 20
  keyName?: string // 文件key值

  formData?: boolean // 是否返回 formData 形式
  base64?: boolean // 是否返回 base64 的值

  [key: string]: any
}

const InputUpload: React.FC<InputUploadProps> = props => {
  const {
    className,
    value,
    onChange,
    base64,
    fileType,
    typeArr,
    formData,
    fileSize,
    children,
    keyName
  } = props

  const intl = useIntl()

  const placeholder = props.placeholder || intl.formatMessage({ id: 'pages.form.clickToUpload' })
  const afterText = props.afterText || intl.formatMessage({ id: 'pages.form.upload' })

  const acceptValue = {
    IMAGE: 'image/*',
    AUDIO: 'audio/*',
    VIDEO: 'video/*'
  }

  const fileLangName = {
    IMAGE: {
      'ja-JP': '画像',
      'en-US': 'picture',
      'zh-CN': '图片',
      reg: '^image/.+$'
    },
    AUDIO: {
      'ja-JP': 'オーディオ',
      'en-US': 'audio',
      'zh-CN': '音频',
      reg: '^audio/.+$'
    },
    VIDEO: {
      'ja-JP': 'ビデオ',
      'en-US': 'video',
      'zh-CN': '视频',
      reg: '^video/.+$'
    },
    FILE: {
      'ja-JP': 'ファイル',
      'en-US': 'file',
      'zh-CN': '文件',
      reg: ''
    }
  }

  const [fileName, setFileName] = useState()

  // useState 不能在函数中实时变化数值所以不用
  let isCan = true

  function beforeUpload(file: File) {
    isCan = true
    const curTypeArr: string[] = typeArr || []
    const fileKeyName = fileLangName[fileType || 'FILE'][intl.locale]

    // 校验传入的格式
    if (curTypeArr.length > 0) {
      const str = curTypeArr.reduce((total, current, index, arr) => {
        return `${total}(.${current}$)${index < arr.length - 1 ? '|' : ''}`
      }, '^.+')

      isCan = new RegExp(str, 'i').test(file.name)

      if (!isCan) {
        const hintStr = {
          'ja-JP': {
            connect: '、',
            last: 'または'
          },
          'en-US': {
            connect: ', ',
            last: ' or '
          },
          'zh-CN': {
            connect: '、',
            last: '或者'
          }
        }

        let typeName: string = ''

        if (hintStr[intl.locale]) {
          typeName = curTypeArr.reduce((prev, next, index, arr) => {
            if (index === arr.length - 1) {
              return prev + hintStr[intl.locale].last + next
            }
            return prev + hintStr[intl.locale].connect + next
          })
        }

        switch (intl.locale) {
          case 'ja-JP':
            message.info(`${typeName}の${fileKeyName}をアップロードしてください`)
            break
          case 'en-US':
            message.info(`Please upload a ${fileKeyName} of ${typeName}`)
            break
          case 'zh-CN':
            message.info(`请上传${typeName}格式的${fileKeyName}`)
            break
          default:
            message.info(`请上传${typeName}格式的${fileKeyName}`)
            break
        }
      }
    }

    // 校验自带的格式
    if (isCan && fileLangName[fileType || 'FILE'].reg) {
      isCan = new RegExp(fileLangName[fileType || 'FILE'].reg, 'i').test(file.type)

      if (!isCan) {
        switch (intl.locale) {
          case 'ja-JP':
            message.info(`${fileKeyName}をアップロードしてください`)
            break
          case 'en-US':
            message.info(`Please upload a ${fileKeyName}`)
            break
          case 'zh-CN':
            message.info(`请上传${fileKeyName}`)
            break
          default:
            message.info(`请上传${fileKeyName}`)
            break
        }
      }
    }

    // 校验大小
    if (isCan && fileSize) {
      isCan = file.size / 1024 / 1024 < fileSize
      if (!isCan) {
        switch (intl.locale) {
          case 'ja-JP':
            message.info(`${fileSize} MB未満の${fileKeyName}をアップロードしてください`)
            break
          case 'en-US':
            message.info(`Please upload a ${fileKeyName} smaller than ${fileSize} MB`)
            break
          case 'zh-CN':
            message.info(`请上传小于${fileSize} MB的${fileKeyName}`)
            break
          default:
            message.info(`请上传小于${fileSize} MB的${fileKeyName}`)
            break
        }
      }
    }

    // 不发请求
    return false
  }

  function handleUploadChange({ file }: { file: any }) {
    if (isCan) {
      // 展示文件名称
      setFileName(file.name)

      if (base64) {
        const reader: any = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          onChange && onChange(reader.result.substring(reader.result.indexOf(',') + 1))
        }
      } else if (formData) {
        const fData = new FormData()
        fData.append(keyName!, file)
        // 在这里修改要返回给 form 的数据。目前返回给 form 的是文件的地址
        onChange && onChange(fData)
      } else {
        onChange && onChange(file)
      }
    }
  }

  const inputFileItemClassName = useEmotionCss(() => ({
    width: '100%',
    display: 'inline-block',

    '.ant-upload': {
      width: '100%'
    }
  }))

  return (
    <div className={classNames(className, inputFileItemClassName)}>
      <Upload
        accept={fileType && acceptValue[fileType]}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleUploadChange}
      >
        <Input.Search
          value={fileName || value}
          placeholder={placeholder}
          enterButton={children || <Button>{afterText}</Button>}
        />
      </Upload>
    </div>
  )
}

InputUpload.defaultProps = {
  fileSize: 20,
  keyName: 'file'
}

export default InputUpload
