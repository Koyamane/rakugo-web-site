/*
 * @Author: dingyun
 * @Date: 2021-12-25 13:34:04
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-20 14:13:52
 * @Description:
 */

import { useIntl } from '@umijs/max'
import { App } from 'antd'
import { useCallback } from 'react'

const useVerifyFileSize = (type?: 'one' | 'some', initSize?: number) => {
  const intl = useIntl()
  const { message } = App.useApp()

  const verifyOneFileSize = useCallback(
    (file: File, size: number | undefined = initSize) => {
      const fileType = file.type.split('/')[0].toLowerCase()

      if (fileType === 'image') {
        const imgSize = size || 10

        if (file.size / 1024 / 1024 > imgSize) {
          switch (intl.locale) {
            case 'ja-JP':
              message.info(`${imgSize} MB未満の画像をアップロードしてください`)
              break
            case 'en-US':
              message.info(`Please upload a picture smaller than ${imgSize} MB`)
              break
            case 'zh-CN':
              message.info(`请上传小于${imgSize} MB的图片`)
              break
            default:
              message.info(`请上传小于${imgSize} MB的图片`)
              break
          }
          return false
        }
      }

      if (fileType === 'audio') {
        const audioSize = size || 20

        if (file.size / 1024 / 1024 > audioSize) {
          switch (intl.locale) {
            case 'ja-JP':
              message.info(`${audioSize} MB未満のオーディオをアップロードしてください`)
              break
            case 'en-US':
              message.info(`Please upload a audio smaller than ${audioSize} MB`)
              break
            case 'zh-CN':
              message.info(`请上传小于${audioSize} MB的音频`)
              break
            default:
              message.info(`请上传小于${audioSize} MB的音频`)
              break
          }
          return false
        }
      }

      if (fileType === 'video') {
        const videoSize = size || 30

        if (file.size / 1024 / 1024 > videoSize) {
          switch (intl.locale) {
            case 'ja-JP':
              message.info(`${videoSize} MB未満のビデオをアップロードしてください`)
              break
            case 'en-US':
              message.info(`Please upload a video smaller than ${videoSize} MB`)
              break
            case 'zh-CN':
              message.info(`请上传小于${videoSize} MB的视频`)
              break
            default:
              message.info(`请上传小于${videoSize} MB的视频`)
              break
          }
          return false
        }
      }

      const fileSize = size || 10

      if (file.size / 1024 / 1024 > fileSize) {
        switch (intl.locale) {
          case 'ja-JP':
            message.info(`${fileSize} MB未満のファイルをアップロードしてください`)
            break
          case 'en-US':
            message.info(`Please upload a file smaller than ${fileSize} MB`)
            break
          case 'zh-CN':
            message.info(`请上传小于${fileSize} MB的文件`)
            break
          default:
            message.info(`请上传小于${fileSize} MB的文件`)
            break
        }
        return false
      }

      return true
    },
    [intl.locale]
  )

  const verifyOneFileSizeNoHint = (file: File, size?: number) => {
    const fileType = file.type.split('/')[0].toLowerCase()

    if (fileType === 'image') {
      const imgSize = size || 10

      if (file.size / 1024 / 1024 > imgSize) {
        return false
      }
    }

    if (fileType === 'audio') {
      const audioSize = size || 20

      if (file.size / 1024 / 1024 > audioSize) {
        return false
      }
    }

    if (fileType === 'video') {
      const videoSize = size || 30

      if (file.size / 1024 / 1024 > videoSize) {
        return false
      }
    }

    const fileSize = size || 10

    if (file.size / 1024 / 1024 > fileSize) {
      return { flag: false, type: 'file' }
    }

    return true
  }

  // 过滤出不匹配的，并给予提示，返回匹配的
  const verifySomeFileSize = useCallback(
    (
      files: File[],
      hintId: string = 'pages.form.file',
      fileSize: number | undefined = initSize
    ) => {
      const fileArr = files.filter(item => verifyOneFileSizeNoHint(item, fileSize))

      if (fileArr.length === files.length) return fileArr

      switch (intl.locale) {
        case 'ja-JP':
          message.info(
            `${fileSize} MBを超える${intl.formatMessage({
              id: hintId
            })}の一部はアップロードされていません`
          )
          break
        case 'en-US':
          message.info(
            `Some ${intl.formatMessage({ id: hintId })}s exceeding ${fileSize} MB were not uploaded`
          )
          break
        case 'zh-CN':
          message.info(`部分超过 ${fileSize} MB的${intl.formatMessage({ id: hintId })}未上传`)
          break
        default:
          message.info(`部分超过 ${fileSize} MB的${intl.formatMessage({ id: hintId })}未上传`)
          break
      }

      return fileArr
    },
    [intl.locale]
  )

  return {
    verifyOneFileSize,
    verifySomeFileSize
  }
}

export default useVerifyFileSize
