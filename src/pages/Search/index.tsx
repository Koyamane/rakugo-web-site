import { BackTop } from '@/components'
import { useGlobalClassName, useGlobalHooks } from '@/hooks'
import { CopyrightOutlined } from '@ant-design/icons'
import { FormattedMessage, useModel } from '@umijs/max'
import { Menu, MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import FilterBar from './components/FilterBar'
import SearchList from './components/SearchList'
import TopSearchBar from './components/TopSearchBar'

export default (): React.ReactNode => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const { formatOptions } = useGlobalHooks()
  const [dtoSort, setDtoSort] = useState<string>('all')
  const { dataDictionaryObj, getDataDictionary } = useModel('useDataDictionary')
  const { homeLayoutClassName, infiniteScrollClassName } = useGlobalClassName()
  const [searchParams, setSearchParams] = useState<API.PageParams>({
    dto: { status: 'APPROVED' },
    sort: { approvedDate: -1 }
  })

  const items: MenuProps['items'] = [
    {
      label: <FormattedMessage id='pages.form.comprehensive' />,
      key: 'all'
    },
    ...(formatOptions(dataDictionaryObj['ARTICLE_SORT'], 'key', 'value', 'key', 'label') as any[])
  ]

  const onClick: MenuProps['onClick'] = e => {
    setDtoSort(e.key)
    setSearchParams((o: API.PageParams) => ({
      ...o,
      dto: {
        ...o.dto,
        sort: e.key === 'all' ? undefined : e.key
      }
    }))
  }

  useEffect(() => {
    getDataDictionary(['ARTICLE_SORT', 'SEARCH_DATE_OPTIONS'])
  }, [])

  return (
    <>
      <TopSearchBar setSearchParams={setSearchParams} />

      <div className={homeLayoutClassName}>
        <div className='home-layout-side-bar'>
          <Menu
            items={items}
            mode='vertical'
            onClick={onClick}
            selectedKeys={[dtoSort]}
            className='home-layout-side-bar-menu'
          />

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
          <FilterBar dtoSort={dtoSort} setDtoSort={setDtoSort} setSearchParams={setSearchParams} />
          <SearchList userId={currentUser?.userId} searchParams={searchParams} />
        </div>
      </div>

      <BackTop />
    </>
  )
}
