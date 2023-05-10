/*
 * @Author: dingyun
 * @Date: 2023-05-10 12:01:37
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-10 15:16:08
 * @Description:
 */
export type BgImageInfo = {
  id?: string
  createdName?: string
  createdId?: string
  createdDate?: string
  updateDate?: number
  order?: number
  imgUrl?: string
  position?: DataDictionary.BG_IMAGE_POSITION
  status?: DataDictionary.NOTIFICATION_STATUS
}
