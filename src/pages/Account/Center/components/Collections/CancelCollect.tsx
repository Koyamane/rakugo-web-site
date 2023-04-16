/*
 * @Author: dingyun
 * @Date: 2023-03-28 12:09:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-06 12:08:58
 * @Description:
 */
import { LoadingOutlined, StarFilled } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { App } from 'antd'
import React, { useState } from 'react'
import { CancelCollectionApi } from '../../service'

interface PropsType {
  blogInfo: any
  onCancelled: () => void
}

const BlogTitle: React.FC<PropsType> = React.memo(props => {
  const { blogInfo, onCancelled } = props
  const [btnLoading, setBtnLoading] = useState(false)
  const intl = useIntl()
  const { message } = App.useApp()

  const handleCancel = async () => {
    setBtnLoading(true)
    try {
      await CancelCollectionApi({
        targetId: blogInfo.status === 'DELETED' ? blogInfo.targetId : blogInfo.id,
        targetType: 'Blog'
      })
      message.success(intl.formatMessage({ id: 'pages.form.canceled' }))
      onCancelled()
    } catch (error) {
      console.log(error)
    }
    setBtnLoading(false)
  }

  const btnClassName = useEmotionCss(({ token }) => ({
    cursor: 'pointer',
    fontSize: token.fontSizeXL,
    color: token.colorPrimaryText
  }))

  return btnLoading ? (
    <LoadingOutlined />
  ) : (
    <StarFilled className={btnClassName} onClick={handleCancel} />
  )
})

export default BlogTitle
