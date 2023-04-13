/*
 * @Author: dingyun
 * @Date: 2023-03-28 19:32:45
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-07 20:44:18
 * @Description:
 */
import { NavLink } from '@umijs/max'
import React from 'react'
// import FollowButton from '@/components/FollowButton'
import styles from '../index.less'

interface PropsType {
  blogInfo: API.BlogInfo
}

const UserContent: React.FC<PropsType> = React.memo(({ blogInfo }) => {
  return (
    <div className={styles.userContent}>
      <NavLink to={`/account/center/${blogInfo.createdId}`}>
        <img src={blogInfo.createdAvatar} alt={blogInfo.createdName} />
      </NavLink>
      <div className={styles.userContentCenter}>
        <NavLink to={`/account/center/${blogInfo.createdId}`}>{blogInfo.createdName}</NavLink>
        <span className='text-ellipsis'>{blogInfo.createdSignature}</span>
      </div>

      {/* <FollowButton className='user-content-follow-btn' mobileModel targetId={blogInfo.createdId} /> */}
    </div>
  )
})

export default UserContent
