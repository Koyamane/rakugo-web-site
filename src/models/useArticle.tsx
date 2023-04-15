/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-14 20:43:54
 * @Description:
 */
import { getArticleDirectory } from '@/utils/tools'
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor'
import { useState } from 'react'

export default function useArticle() {
  const [followed, setFollowed] = useState(false)
  const [directoryList, setDirectoryList] = useState<AnchorLinkItemProps[]>([])

  const getDirectoryList = (target: string) => {
    setDirectoryList(getArticleDirectory(target))
  }

  return {
    followed,
    setFollowed,
    directoryList,
    setDirectoryList,
    getDirectoryList
  }
}
