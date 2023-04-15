/*
 * @Author: dingyun
 * @Date: 2023-03-28 12:09:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-06 12:09:04
 * @Description:
 */
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { Link, NavLink, useIntl } from '@umijs/max'
import { Dropdown, MenuProps, Modal } from 'antd'
import React, { useMemo } from 'react'
import styles from './index.less'

interface PropsType {
  deleteBlog: (id: API.BlogInfo['id']) => void
  isMe?: boolean
  blogInfo: API.BlogInfo
}

const BlogTitle: React.FC<PropsType> = React.memo(props => {
  const { blogInfo, isMe, deleteBlog } = props
  const intl = useIntl()

  const handleDeleteBlog = async (title: API.BlogInfo['title'], id: API.BlogInfo['id']) => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'pages.form.delete.title',
        defaultMessage: '确定要删除吗？'
      }),
      icon: <ExclamationCircleOutlined />,
      content: title,
      okType: 'danger',
      onOk() {
        deleteBlog(id)
      }
    })
  }

  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'list-vertical-edit',
        label: (
          <Link to={`/post/${blogInfo.id}`}>
            {intl.formatMessage({ id: 'pages.form.edit', defaultMessage: '编辑' })}
          </Link>
        ),
        icon: <EditOutlined />
      },
      {
        key: 'list-vertical-delete',
        label: (
          <a
            onClick={e => {
              e.preventDefault()
              handleDeleteBlog(blogInfo.title, blogInfo.id)
            }}
          >
            {intl.formatMessage({ id: 'pages.form.delete', defaultMessage: '删除' })}
          </a>
        ),
        icon: <DeleteOutlined />
      }
    ]
  }, [blogInfo, intl])

  return (
    <div className={`${styles.blogTitle} ant-list-item-meta-title`}>
      <NavLink className={styles.blogTitleLeft} to={`/article/${blogInfo.id}`}>
        {blogInfo.title}
      </NavLink>

      {isMe && (
        <Dropdown menu={{ items }}>
          <a onClick={e => e.preventDefault()}>
            <EllipsisOutlined />
          </a>
        </Dropdown>
      )}
    </div>
  )
})

export default BlogTitle
