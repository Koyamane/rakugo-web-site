/*
 * @Author: dingyun
 * @Date: 2023-03-28 12:09:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-24 13:38:32
 * @Description:
 */
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { history, useIntl } from '@umijs/max'
import { App, Dropdown, MenuProps, Modal } from 'antd'
import React, { useMemo, useState } from 'react'
import { DeleteBlogApi } from '../../service'

interface PropsType {
  onDeleted: () => void
  blogInfo: API.BlogInfo
}

const OperateItem: React.FC<PropsType> = React.memo(props => {
  const { blogInfo, onDeleted } = props
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const [modal, contextHolder] = Modal.useModal()

  const handleDeleteBlog = async () => {
    modal.confirm({
      title: intl.formatMessage({ id: 'pages.form.delete.title' }),
      icon: <ExclamationCircleOutlined />,
      content: blogInfo.title,
      okType: 'danger',
      async onOk() {
        setLoading(true)
        try {
          await DeleteBlogApi(blogInfo.id)
          message.success(intl.formatMessage({ id: 'pages.form.delete.success' }))
          onDeleted()
        } catch (error) {
          message.success(intl.formatMessage({ id: 'pages.form.delete.error' }))
        }
        setLoading(false)
      }
    })
  }

  const goEdit = () => {
    if (blogInfo.editor === 'RICH_TEXT') {
      history.push(`/post/rt/${blogInfo.id}`)
      return
    }

    history.push(`/post/md/${blogInfo.id}`)
  }

  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'list-vertical-edit',
        label: (
          <a
            onClick={e => {
              e.preventDefault()
              goEdit()
            }}
          >
            {intl.formatMessage({ id: 'pages.form.edit' })}
          </a>
        ),
        icon: <EditOutlined />
      },
      {
        key: 'list-vertical-delete',
        label: (
          <a
            onClick={e => {
              e.preventDefault()
              handleDeleteBlog()
            }}
          >
            {intl.formatMessage({ id: 'pages.form.delete' })}
          </a>
        ),
        icon: <DeleteOutlined />
      }
    ]
  }, [intl])

  const operateClassName = useEmotionCss(({ token }) => ({
    fontSize: token.fontSizeXL
  }))

  return (
    <>
      {contextHolder}

      {loading ? (
        <LoadingOutlined />
      ) : (
        <Dropdown menu={{ items }}>
          <a onClick={e => e.preventDefault()}>
            <EllipsisOutlined className={operateClassName} />
          </a>
        </Dropdown>
      )}
    </>
  )
})

export default OperateItem
