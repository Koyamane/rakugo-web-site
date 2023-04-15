/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-15 16:11:14
 * @Description:
 */
import { CommentType, LikeObjType } from '@/components/Comment/data'
import { useModel } from '@umijs/max'
import { useState } from 'react'

export default function useComment() {
  // likeObj，是专门用来记录所有评论的点赞和点踩状态的
  const [likeObj, setLikeObj] = useState<LikeObjType>({})
  const [currentComment, setCurrentComment] = useState<CommentType>()
  const [commenting, setCommenting] = useState(false)
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const treeToObj: any = (treeList: any[]) => {
    const newObj: any[] = []
    function obj(sourceArr: any[]) {
      sourceArr.forEach(item => {
        newObj[item.id] = {
          likes: item.likeArr.length,
          liked: item.likeArr.includes(currentUser?.userId || ''),
          dislikes: item.dislikeArr.length,
          disliked: item.dislikeArr.includes(currentUser?.userId || '')
        }
        item.children && item.children.length > 0 && obj(item.children)
      })
      return newObj
    }
    return obj(treeList)
  }

  const deleteLikeObjSomeone = (id: string) => {
    // 这里不能用 json 转换了
    const obj = { ...likeObj }
    delete obj[id]
    setLikeObj(obj)
  }

  const formatSetLikeObj = (target: object | [], isAdd?: boolean) => {
    setLikeObj(
      isAdd
        ? {
            ...likeObj,
            ...(Array.isArray(target) ? treeToObj(target) : target)
          }
        : Array.isArray(target)
        ? treeToObj(target)
        : target
    )
  }

  return {
    likeObj,
    setLikeObj: formatSetLikeObj,
    deleteLikeObjSomeone,
    commenting,
    setCommenting,
    currentComment,
    setCurrentComment
  }
}
