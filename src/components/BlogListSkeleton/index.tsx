/*
 * @Author: dingyun
 * @Date: 2023-03-21 16:39:50
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-03-21 19:32:13
 * @Description:
 */
import { List, Skeleton } from 'antd'
import React, { useMemo } from 'react'

interface BlogSkeletonProps {
  loading: boolean
  num?: number
  rows?: number
  className?: string
  children?: React.ReactNode
  avatar?: boolean
  split?: boolean
}

const BlogListSkeleton: React.FC<BlogSkeletonProps> = React.memo(props => {
  const { loading, num, rows, split, className, avatar, children } = props
  const paragraph = { rows: rows || 4 }
  const listData = useMemo(() => {
    return Array.from({ length: num || 3 }).map((item, index) => index)
  }, [num])

  return (
    <>
      {loading ? (
        <List
          size='large'
          split={split}
          itemLayout='vertical'
          className={className}
          dataSource={listData}
          renderItem={item => (
            <List.Item key={item}>
              <Skeleton loading paragraph={paragraph} active avatar={avatar}>
                <List.Item.Meta />
              </Skeleton>
            </List.Item>
          )}
        />
      ) : (
        children
      )}
    </>
  )
})

export default BlogListSkeleton
