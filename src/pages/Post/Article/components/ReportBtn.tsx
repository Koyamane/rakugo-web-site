/*
 * @Author: dingyun
 * @Date: 2023-04-25 16:04:03
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-25 19:06:06
 * @Description:
 */
import { WarningOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Button } from 'antd'
import React from 'react'

interface ReportBtnForm {
  reason: string
  explanation: string
  picture: string
}

const ReportBtn: React.FC = React.memo(() => {
  return (
    <ModalForm<ReportBtnForm>
      // onFinish={handleModify}
      // onOpenChange={visible => visible && form.resetFields()}
      title='举报反馈'
      trigger={<Button shape='circle' size='large' icon={<WarningOutlined />} />}
    >
      <ProFormText name='reason' label='举报原因' />
      <ProFormText name='explanation' label='补充说明' />
      <ProFormText name='picture' label='相关图片' />
    </ModalForm>
  )
})

export default ReportBtn
