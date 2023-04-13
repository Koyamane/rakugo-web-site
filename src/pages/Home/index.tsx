/*
 * @Author: dingyun
 * @Date: 2023-04-12 22:45:02
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-13 15:46:58
 * @Description:
 */
import sakuraBg from '@/assets/sakura.jpg'
import { SoundOutlined } from '@ant-design/icons'
import { useToken } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Affix, Alert, FloatButton } from 'antd'
import React, { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import { useModel } from 'umi'
import HomeList from './components/HomeList'
import SortSideBar from './components/SortSideBar'
import { AnnouncementInfo, BlogSortKey } from './data'
import { AnnouncementPageApi } from './services'

export default (): React.ReactNode => {
  const [announcementList, setAnnouncementList] = useState<AnnouncementInfo[]>([])
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const [sortKey, setSortKey] = useState<BlogSortKey>('createdDate')
  const { token } = useToken()

  const homeLayoutClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      alignItems: 'flex-start',
      marginBlockStart: token.marginMD,

      '.home-layout-side-bar': {
        flexShrink: '0',
        minWidth: '180px',
        marginInlineEnd: token.marginMD,

        '&-menu': {
          borderRadius: token.borderRadius,
          border: 'none !important'
        },

        '&-title': {
          width: '100%',
          display: 'flex',
          color: '#fedfe1',
          alignItems: 'center',
          fontFamily: ['Segoe UI'],
          writingMode: 'vertical-rl',
          fontSize: token.fontSizeHeading3,
          marginTop: token.marginMD,
          padding: `${token.paddingSM}px 0`,
          backgroundImage: `url(${sakuraBg})`,
          backgroundPosition: 'bottom',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          textShadow: '0.5px #00000066',
          WebkitTextStroke: '0.5px #2a2828b3',
          borderRadius: token.borderRadius,

          rt: {
            fontSize: token.fontSizeLG
          }
        }
      },

      // 放后面权重高，所以媒体查询要放后面来
      [`@media screen and (max-width: ${token.screenLG}px)`]: {
        '.home-layout-side-bar': {
          display: 'none'
        }
      }
    }
  })

  const announcementItemClassName = useEmotionCss(({ token }) => {
    return {
      marginInlineEnd: token.marginXL
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

      <div className={homeLayoutClassName}>
        <Affix className='home-layout-side-bar' offsetTop={token.marginMD}>
          <div>
            <SortSideBar setSortKey={setSortKey} sortKey={sortKey} />

            <div className='home-layout-side-bar-title'>
              <ruby>
                <ruby>
                  <span>生</span>
                  <rp>(</rp>
                  <rt>い</rt>
                  <rp>)</rp>
                </ruby>
                <span>きているだけで、</span>
                <ruby>
                  <span>大変</span>
                  <rp>(</rp>
                  <rt>たいへん</rt>
                  <rp>)</rp>
                </ruby>
                <span>だ</span>
              </ruby>
            </div>
          </div>
        </Affix>

        <div style={{ flex: 1 }}>
          <HomeList userId={currentUser?.userId} sortKey={sortKey} />
        </div>
      </div>

      <FloatButton.BackTop />
    </>
  )
}
