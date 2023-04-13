/*
 * @Author: dingyun
 * @Date: 2023-04-12 22:45:02
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-13 13:49:34
 * @Description:
 */
import { SoundOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Alert, FloatButton } from 'antd'
import React, { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import { useModel } from 'umi'
import HomeList from './components/HomeList'
import { AnnouncementInfo } from './data'
import { AnnouncementPageApi } from './services'

export default (): React.ReactNode => {
  const [announcementList, setAnnouncementList] = useState<AnnouncementInfo[]>([])
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const announcementItemClassName = useEmotionCss(({ token }) => {
    return {
      marginInlineEnd: token.marginXL
    }
  })

  const alertClassName = useEmotionCss(({ token }) => {
    return {
      marginBlockEnd: token.marginMD
    }
  })

  const getAnnouncementList = async () => {
    try {
      const data = await AnnouncementPageApi({
        dto: { status: 'NOT_EXPIRED' },
        searchMap: {
          access: {
            opt: 'IN',
            value: 'all,' + (currentUser?.access || 'user')
          }
        }
      })
      setAnnouncementList(data.list)
    } catch (error) {
      console.log('获取通知失败了')
    }
  }

  useEffect(() => {
    getAnnouncementList()
  }, [])

  return (
    <>
      {!!announcementList.length && (
        <Alert
          banner
          showIcon
          className={alertClassName}
          icon={<SoundOutlined />}
          message={
            <Marquee pauseOnHover gradient={false}>
              {announcementList.map(item => (
                <div key={item.id} className={announcementItemClassName}>
                  {item.title}
                </div>
              ))}
            </Marquee>
          }
        />
      )}

      <HomeList userId={currentUser?.userId} />

      <FloatButton.BackTop />
    </>
  )
}
