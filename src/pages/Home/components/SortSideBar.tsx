import { FormattedMessage } from '@umijs/max'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import React from 'react'
import { BlogSortKey } from '../data'

interface SortSideBarProps {
  sortKey: BlogSortKey
  setSortKey: (value: BlogSortKey) => void
}

const SortSideBar: React.FC<SortSideBarProps> = React.memo(({ setSortKey, sortKey }) => {
  const items: MenuProps['items'] = [
    {
      label: <FormattedMessage id='pages.blog.sort.createdDate' />,
      key: 'createdDate'
    },
    {
      label: <FormattedMessage id='pages.blog.sort.reads' />,
      key: 'reads'
    },
    {
      label: <FormattedMessage id='pages.blog.sort.likes' />,
      key: 'likes'
    },
    {
      label: <FormattedMessage id='pages.blog.sort.collections' />,
      key: 'collections'
    },
    {
      label: <FormattedMessage id='pages.blog.sort.comments' />,
      key: 'comments'
    }
  ]

  const onClick: MenuProps['onClick'] = e => {
    setSortKey(e.key as BlogSortKey)
  }

  return (
    <Menu
      onClick={onClick}
      mode='vertical'
      items={items}
      selectedKeys={[sortKey]}
      className='home-layout-side-bar-menu'
    />
  )
})

export default SortSideBar
