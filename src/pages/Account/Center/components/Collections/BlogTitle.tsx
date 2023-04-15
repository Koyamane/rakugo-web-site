/*
 * @Author: dingyun
 * @Date: 2023-03-28 12:09:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-06 12:08:58
 * @Description:
 */
import IconText from '@/components/IconText'
import { StarFilled } from '@ant-design/icons'
import { NavLink, useIntl } from '@umijs/max'
import { App } from 'antd'
import React, { useState } from 'react'
import { CancelCollectionApi } from '../../service'
import styles from '../Articles/index.less'

interface PropsType {
  blogInfo: any
  isMe?: boolean
  initList: () => void
}

const BlogTitle: React.FC<PropsType> = React.memo(props => {
  const { blogInfo, isMe, initList } = props
  const [btnLoading, setBtnLoading] = useState(false)
  const intl = useIntl()
  const { message } = App.useApp()

  const handleCancel = async () => {
    if (btnLoading) return
    setBtnLoading(true)
    try {
      await CancelCollectionApi({
        targetId: blogInfo.status === 'DELETED' ? blogInfo.targetId : blogInfo.id,
        targetType: 'Blog'
      })
      setBtnLoading(false)
      message.success(
        intl.formatMessage({
          id: 'pages.form.canceled',
          defaultMessage: '已取消'
        })
      )
      initList()
    } catch (error) {
      setBtnLoading(false)
      console.log(error)
    }
  }

  return (
    <div className={`${styles.blogTitle} ant-list-item-meta-title`}>
      <NavLink className={styles.blogTitleLeft} to={`/article/${blogInfo.id}`}>
        {blogInfo.title}
      </NavLink>

      {isMe && (
        <IconText
          icon={StarFilled}
          onClick={handleCancel}
          key='list-vertical-collections'
          className={styles.blogLargeStar}
        />
      )}
    </div>
  )
})

export default BlogTitle
