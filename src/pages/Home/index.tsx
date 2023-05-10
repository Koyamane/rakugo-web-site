import { BackTop } from '@/components'
import { useGlobalClassName, useGlobalHooks } from '@/hooks'
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
import { BgImageInfoApi } from '../Admin/WebsiteBgManagement/service'

export default (): React.ReactNode => {
  const { formatValue } = useGlobalHooks()
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const [sortKey, setSortKey] = useState<BlogSortKey>('approvedDate')
  const [sideBg, setSideBg] = useState('')
  const { homeLayoutClassName, infiniteScrollClassName } = useGlobalClassName()
  const [announcementList, setAnnouncementList] = useState<AnnouncementInfo[]>([])

  const announcementClassName = useEmotionCss(({ token }) => ({
    marginBlockEnd: token.marginMD
  }))

  const announcementItemClassName = useEmotionCss(({ token }) => {
    return {
      marginInlineEnd: token.marginXL
    }
  })

  const sideBarTitleClassName = useEmotionCss(({ token }) => ({
    width: '100%',
    display: 'flex',
    color: '#fedfe1',
    alignItems: 'center',
    fontFamily: ['Segoe UI'],
    writingMode: 'vertical-rl',
    fontSize: token.fontSizeHeading3,
    marginInlineStart: token.marginMD,
    padding: `${token.paddingSM}px 0`,
    backgroundImage: sideBg ? `url(${sideBg})` : 'none',
    backgroundPosition: 'bottom',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    textShadow: '0.5px #00000066',
    WebkitTextStroke: '0.5px #2a2828b3',
    borderRadius: token.borderRadius,

    rt: {
      fontSize: token.fontSizeLG
    }
  }))

  const getSideBg = async () => {
    try {
      const bgInfo = await BgImageInfoApi({ position: 'HOME_SIDE_TITLE' })
      setSideBg(bgInfo?.imgUrl || '')
    } catch (error) {
      console.log(error)
    }
  }

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
    getSideBg()
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
            <Marquee pauseOnHover speed={30} gradient={false}>
              {announcementList.map(item => (
                <div key={item.id} className={announcementItemClassName}>
                  {formatValue(item, 'title')}
                </div>
              ))}
            </Marquee>
          }
        />
      )}

      <div className={homeLayoutClassName}>
        <div className='home-layout-side-bar'>
          <SortSideBar setSortKey={setSortKey} sortKey={sortKey} />

          <div className={sideBarTitleClassName}>
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

        <div className={infiniteScrollClassName}>
          <HomeList userId={currentUser?.userId} sortKey={sortKey} />
        </div>
      </div>

      <BackTop />
    </>
  )
}
