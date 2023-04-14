/*
 * @Author: dingyun
 * @Date: 2023-04-14 12:25:27
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 13:29:44
 * @Description:
 */
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { BackTopProps, FloatButton } from 'antd'
import classNames from 'classnames'
import React from 'react'

const BackTop: React.FC<BackTopProps> = React.memo(({ className, ...restProps }) => {
  const backTopClassName = useEmotionCss(() => {
    return {
      right: '6%',
      bottom: '100px'
    }
  })

  return <FloatButton.BackTop className={classNames(className, backTopClassName)} {...restProps} />
})

export default BackTop
