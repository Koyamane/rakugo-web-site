/*
 * @Author: dingyun
 * @Date: 2023-04-12 20:13:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-24 15:37:40
 * @Description:
 */
import { DeleteFile } from '@/services/global'
import { debounce, getArticleDirectory } from '@/utils/tools'
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor'
import { useState } from 'react'

// 这些数据不需要及时刷新组件，所以写外面
let fileObj: Record<string, string[]> = {
  contentFileArr: [], // 现存的文件
  existingFileList: [], // 已有的文件对象，比如编辑时的
  newFileList: [] // 新增的文件对象
}
// 是否全删除图片，没发布直接退出需要全删
let isAllDelete = true

export default function useArticle() {
  const [followed, setFollowed] = useState(false)
  const [directoryList, setDirectoryList] = useState<AnchorLinkItemProps[]>([])

  const getDirectoryList = (target: string) => {
    setDirectoryList(getArticleDirectory(target))
  }

  const [mainText, setMainText] = useState('')

  const setIsAllDelete = (flag: boolean) => {
    isAllDelete = flag
  }

  const setFileObj = (objs: Record<string, string[]>) => {
    fileObj = {
      ...fileObj,
      ...objs
    }
  }

  /**
   * @description 存储上传的文件地址
   * @param fileUrl 新增的文件地址数组
   */
  const addFileList = (fileUrl: string[]) => {
    setFileObj({
      newFileList: [...fileObj.newFileList, ...fileUrl],
      existingFileList: [...fileObj.existingFileList, ...fileUrl]
    })
  }

  const initFileList = (fileUrl: string[]) => {
    setFileObj({
      contentFileArr: [...fileUrl],
      existingFileList: [...fileUrl]
    })
  }

  const setContentFileArr = (fileUrl: string[]) => {
    setFileObj({
      contentFileArr: [...fileUrl]
    })
  }

  /**
   * @description 重置图片相关数据
   */
  const resetImgData = () => {
    setMainText('')
    setIsAllDelete(true)
    setFileObj({
      newFileList: [],
      contentFileArr: [],
      existingFileList: []
    })
  }

  const onMainTextChange = (value: string) => {
    debounce(() => {
      setMainText(value)
      setTimeout(() => {
        const fileNodeArr = document.querySelectorAll('.post-article-editor img')
        const urlArr: string[] = []
        fileNodeArr.length &&
          fileNodeArr.forEach((item: any) => {
            urlArr.push(item.getAttribute('src') || '')
          })
        // 赋值已有文件地址
        setFileObj({ contentFileArr: [...urlArr] })
      })
    }, 400)()
  }

  // 关闭、刷新页面时要做的事
  const leavePage = () => {
    const { existingFileList, newFileList, contentFileArr } = fileObj

    // 没传不用处理
    if (!existingFileList.length) {
      resetImgData()
      return
    }

    // 没发布直接退出页面时
    if (isAllDelete) {
      // 如果传了，需要删除新上传的
      newFileList.length && DeleteFile(newFileList)
      resetImgData()
      return
    }

    if (existingFileList.length !== contentFileArr.length) {
      const deleteImgArr = existingFileList.filter(item => {
        return !contentFileArr.find(item2 => item === item2)
      })

      deleteImgArr.length && DeleteFile(deleteImgArr)
    }

    resetImgData()
  }

  return {
    followed,
    setFollowed,
    directoryList,
    setDirectoryList,
    getDirectoryList,

    setFileObj,
    leavePage,
    mainText,
    setMainText,
    addFileList,
    resetImgData,
    initFileList,
    setIsAllDelete,
    onMainTextChange,
    setContentFileArr
  }
}
