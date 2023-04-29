import { UpdateCurrentUser } from '@/services/global'
import { getStrLen } from '@/utils/tools'
import ProForm, { ProFormCascader, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { App, Button } from 'antd'
import React, { useState } from 'react'
import ChinaCityTree from '../geographic/china.json'
import AvatarCrop from './AvatarCrop'

const BaseView: React.FC = () => {
  const intl = useIntl()
  const { message } = App.useApp()
  const [btnLoading, setBtnLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser || {}

  const checkNickname = (_: any, value: string) => {
    if (value && /^\s*$/.test(value)) {
      return Promise.reject(
        <FormattedMessage id='pages.form.space.error' defaultMessage='不能全是空格' />
      )
    }

    if (value && value.length > 30) {
      return Promise.reject(
        <FormattedMessage id='pages.form.tooLong30' defaultMessage='不能超过30个字符' />
      )
    }

    return Promise.resolve()
  }

  const checkTags = (_: any, valArr: string[]) => {
    if (valArr.some(item => getStrLen(item) > 20)) {
      return Promise.reject(
        <FormattedMessage id='pages.form.tag.error' defaultMessage='单个标签长度不能大于20' />
      )
    }

    return Promise.resolve()
  }

  const handleFinish = async (formData: API.UpdateCurrentUser) => {
    setBtnLoading(true)
    try {
      await UpdateCurrentUser({ ...formData })
      message.success(
        intl.formatMessage({
          id: 'pages.account.update.success',
          defaultMessage: '更新基本信息成功！'
        })
      )

      setInitialState(s => ({
        ...s,
        currentUser: {
          ...currentUser,
          ...formData
        }
      }))
    } catch (error) {
      console.log(error)
    }
    setBtnLoading(false)
  }

  const submitBox = (props: any) => {
    return [
      <Button key='reset' disabled={btnLoading} onClick={() => props.form?.resetFields?.()}>
        {intl.formatMessage({
          id: 'pages.form.reset',
          defaultMessage: '重置'
        })}
      </Button>,
      <Button key='submit' type='primary' htmlType='submit' loading={btnLoading}>
        {intl.formatMessage({
          id: 'pages.account.basic.update',
          defaultMessage: '更新基本信息'
        })}
      </Button>
    ]
  }

  const baseViewClassName = useEmotionCss(({ token }) => ({
    display: 'flex',
    paddingBlockStart: token.paddingSM,
    paddingBlockEnd: token.paddingMD,

    '.account-settings-base': {
      '&-left': {
        minWidth: '220px',
        maxWidth: '440px'
      },

      '&-right': {
        flex: '1',
        paddingInlineStart: '100px',

        '&-avatar-title': {
          marginBottom: token.marginXS,
          color: token.colorTextHeading
        },

        '&-avatar': {
          width: '144px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',

          img: {
            width: '100%',
            height: '144px',
            borderRadius: '50%',
            marginBlockEnd: token.marginSM
          }
        }
      }
    },

    [`@media screen and (max-width: ${token.screenXL}px)`]: {
      '&.account-settings-base': {
        flexDirection: 'column-reverse'
      },

      '.account-settings-base-right': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: '440px',
        padding: token.paddingMD,
        paddingBlockStart: '0',

        '&-avatar-title': {
          display: 'none'
        }
      }
    }
  }))

  return (
    <div className={baseViewClassName + ' account-settings-base'}>
      <div className='account-settings-base-left'>
        <ProForm<API.UserInfo>
          layout='vertical'
          hideRequiredMark
          onFinish={handleFinish}
          initialValues={{ ...currentUser }}
          submitter={{
            render: submitBox
          }}
        >
          <ProFormText
            readonly
            name='username'
            label={intl.formatMessage({
              id: 'pages.login.username',
              defaultMessage: '用户名'
            })}
          />

          <ProFormText
            width='md'
            name='nickname'
            label={intl.formatMessage({
              id: 'pages.account.basic.nickname',
              defaultMessage: '昵称'
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.account.basic.nickname-message'
                    defaultMessage='请输入您的昵称！'
                  />
                )
              },
              { validator: checkNickname }
            ]}
          />

          <ProFormText
            width='md'
            name='post'
            label={intl.formatMessage({
              id: 'pages.account.basic.post',
              defaultMessage: '职位'
            })}
          />

          <ProFormText
            name='signature'
            label={intl.formatMessage({
              id: 'pages.account.basic.signature',
              defaultMessage: '个性签名'
            })}
          />

          <ProFormSelect
            name='tags'
            mode='tags'
            options={[]}
            label={intl.formatMessage({
              id: 'pages.account.basic.tags',
              defaultMessage: '标签'
            })}
            rules={[{ validator: checkTags }]}
            placeholder={intl.formatMessage({ id: 'pages.form.inputMsg' })}
          />

          <ProFormSelect
            width='sm'
            name='country'
            label={intl.formatMessage({
              id: 'pages.account.basic.country',
              defaultMessage: '国家/地区'
            })}
            allowClear={false}
            options={[
              {
                label: '中国',
                value: 'China'
              }
            ]}
          />

          <ProFormCascader
            name='area'
            label={intl.formatMessage({
              id: 'pages.account.basic.geographic',
              defaultMessage: '省市区'
            })}
            fieldProps={{
              changeOnSelect: true,
              options: ChinaCityTree
            }}
          />

          <ProFormText
            width='md'
            name='address'
            label={intl.formatMessage({
              id: 'pages.account.basic.address',
              defaultMessage: '街道地址'
            })}
          />
        </ProForm>
      </div>

      <div className='account-settings-base-right'>
        <AvatarCrop />
      </div>
    </div>
  )
}

export default BaseView
