/*
 * @Author: dingyun
 * @Date: 2022-01-03 13:24:02
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-02-28 21:50:42
 * @Description:
 */
import { UploadOutlined } from '@ant-design/icons'
import { useIntl, useModel } from '@umijs/max'
import { App, Button, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import 'antd/es/modal/style'
import 'antd/es/slider/style'
import React, { useMemo, useState } from 'react'
import { UpdateAvatarApi } from '../service'

const AvatarCrop: React.FC = () => {
  const intl = useIntl()
  const { message } = App.useApp()
  const [btnLoading, setBtnLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')
  const avatarStr = useMemo(() => {
    return initialState?.currentUser?.avatar
  }, [initialState?.currentUser?.avatar])

  const checkSize = (file: File) => {
    if (!file.type || !/^image\/.+$/.test(file.type)) {
      return false
    }

    if (file.size / 1024 / 1024 > 1) {
      message.info(
        intl.formatMessage({
          id: 'pages.account.basic.avatar.info',
          defaultMessage: '请上传小于1 MB的图片'
        })
      )
      return false
    }

    return true
  }

  const handleOk = (file: any) => {
    setBtnLoading(true)
    // 这里改成异步，让对话框先关闭
    setTimeout(async () => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const avatarPath = await UpdateAvatarApi(formData)
        message.success(
          intl.formatMessage({
            id: 'pages.account.basic.avatar.success',
            defaultMessage: '更换头像成功！'
          })
        )

        setInitialState(s => ({
          ...s,
          currentUser: {
            ...s?.currentUser,
            avatar: avatarPath
          }
        }))
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'pages.account.basic.avatar.error',
            defaultMessage: '更换失败，请重试！'
          })
        )
      }
      setBtnLoading(false)
    })

    return true
  }

  // 这个 ImgCrop 外面不能直接套div，否则样式就没了
  return (
    <>
      <div className='account-settings-base-right-avatar-title'>
        {intl.formatMessage({
          id: 'pages.account.basic.avatar',
          defaultMessage: '头像'
        })}
      </div>
      <div className='account-settings-base-right-avatar'>
        <img src={avatarStr} alt='avatar' />

        <ImgCrop
          rotationSlider
          cropShape='round'
          beforeCrop={checkSize}
          onModalOk={handleOk}
          modalTitle={intl.formatMessage({ id: 'pages.form.editImage' })}
        >
          <Upload disabled={btnLoading} showUploadList={false}>
            <Button loading={btnLoading} icon={<UploadOutlined />}>
              {intl.formatMessage({ id: 'pages.account.basic.change-avatar' })}
            </Button>
          </Upload>
        </ImgCrop>
      </div>
    </>
  )
}

export default AvatarCrop
