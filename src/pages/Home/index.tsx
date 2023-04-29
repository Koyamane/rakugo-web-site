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

export default (): React.ReactNode => {
  const { formatValue } = useGlobalHooks()
  const { homeLayoutClassName, infiniteScrollClassName } = useGlobalClassName()
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const [sortKey, setSortKey] = useState<BlogSortKey>('createdDate')
  const [announcementList, setAnnouncementList] = useState<AnnouncementInfo[]>([])

  const announcementClassName = useEmotionCss(({ token }) => ({
    marginBlockEnd: token.marginMD
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

        <div className={infiniteScrollClassName}>
          <HomeList userId={currentUser?.userId} sortKey={sortKey} />
        </div>
      </div>

      <BackTop />
    </>
  )
}
