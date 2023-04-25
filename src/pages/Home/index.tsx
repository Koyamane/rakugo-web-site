import sideBg from '@/assets/木に寄りかかる女の子.jpg'
import { BackTop } from '@/components'
import { AnnouncementInfo } from '@/pages/Admin/AnnouncementManagement/data'
import { AnnouncementPageApi } from '@/pages/Admin/AnnouncementManagement/service'
import { CopyrightOutlined, SoundOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useModel } from '@umijs/max'
import { Alert } from 'antd'
import React, { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import HomeList from './components/HomeList'
import SortSideBar from './components/SortSideBar'
import { BlogSortKey } from './data'

export default (): React.ReactNode => {
  const [announcementList, setAnnouncementList] = useState<AnnouncementInfo[]>([])
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const [sortKey, setSortKey] = useState<BlogSortKey>('createdDate')

  const announcementClassName = useEmotionCss(({ token }) => ({
    marginBlockEnd: token.marginMD
  }))

  const homeLayoutClassName = useEmotionCss(({ token }) => ({
    display: 'flex',
    alignItems: 'flex-start',

    '.home-layout-side-bar': {
      flexShrink: '0',
      position: 'sticky',
      minWidth: '180px',
      top: token.marginMD,
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
        marginInline: token.marginMD,
        padding: `${token.paddingSM}px 0`,
        backgroundImage: `url(${sideBg})`,
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        textShadow: '0.5px #00000066',
        WebkitTextStroke: '0.5px #2a2828b3',
        borderRadius: token.borderRadius,

        rt: {
          fontSize: token.fontSizeLG
        }
      },

      '&-copyright': {
        textAlign: 'center',
        color: token.colorText,
        paddingBlock: token.paddingSM,
        paddingInline: token.paddingMD,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
        a: {
          color: token.colorText,
          '&:hover': {
            color: token.colorText,
            textDecoration: 'underline'
          }
        }
      }
    },

    // 放后面权重高，所以媒体查询要放后面来
    [`@media screen and (max-width: ${token.screenLG}px)`]: {
      '.home-layout-side-bar': {
        display: 'none'
      }
    }
  }))

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
          className={announcementClassName}
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
        <div className='home-layout-side-bar'>
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

          <div className='home-layout-side-bar-copyright'>
            <div>
              <CopyrightOutlined /> 2023 <FormattedMessage id='app.copyright.produced' />
            </div>
            <div>
              <a target='_blank' href='https://beian.miit.gov.cn/' rel='noopener noreferrer'>
                赣ICP备2021009462号-1
              </a>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <HomeList userId={currentUser?.userId} sortKey={sortKey} />
        </div>
      </div>

      <BackTop />
    </>
  )
}
