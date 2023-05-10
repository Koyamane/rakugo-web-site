import { Drawer } from '@/components'
import { useGlobalHooks } from '@/hooks'
import { FilterOutlined } from '@ant-design/icons'
import { ProForm, ProFormSelect } from '@ant-design/pro-form'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useModel } from '@umijs/max'
import { Divider, Form, Select, Space } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useState } from 'react'

interface FilterBarProps {
  dtoSort: string
  setDtoSort: (value: string) => void
  setSearchParams: React.Dispatch<React.SetStateAction<API.PageParams>>
}

const FilterBar: React.FC<FilterBarProps> = ({ dtoSort, setDtoSort, setSearchParams }) => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const { formatOptions } = useGlobalHooks()
  const [curDate, setCurDate] = useState('none')
  const [curSort, setCurSort] = useState('approvedDate')
  const { dataDictionaryObj } = useModel('useDataDictionary')
  const sortOptions = [
    {
      value: 'all',
      label: <FormattedMessage id='pages.form.comprehensive' />
    },
    ...formatOptions(dataDictionaryObj['ARTICLE_SORT'])
  ]

  const filterBarClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      alignItems: 'center',
      paddingBlock: token.paddingSM,
      justifyContent: 'space-between',
      color: token.colorTextDescription,
      borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,

      '.filter-bar-btn': {
        cursor: 'pointer',
        '&:hover': {
          color: token.colorPrimaryTextHover
        },
        '&.active': {
          color: token.colorPrimaryText
        }
      },

      '.filter-bar-right': {
        '&-btn': {
          display: 'none',
          fontSize: token.fontSizeLG
        }
      },

      '.ant-select': {
        minWidth: '100px'
      },

      [`@media screen and (max-width: ${token.screenLG}px)`]: {
        '.filter-bar-right-btn': {
          display: 'inline-block'
        },
        '.filter-bar-right-select': {
          display: 'none'
        }
      }
    }
  })

  const dateOptions = formatOptions(dataDictionaryObj['SEARCH_DATE_OPTIONS'], 'key', 'value')

  const sortItem = [
    {
      label: <FormattedMessage id='pages.sort.upToDate' />,
      value: 'approvedDate'
    },
    {
      label: <FormattedMessage id='pages.sort.hottest' />,
      value: 'likes'
    }
  ]

  const handleFilter = (value: string) => {
    setCurSort(value)
    setSearchParams((o: API.PageParams) => ({
      ...o,
      sort: { [value]: -1 }
    }))
  }

  const handleSelect = (value: string) => {
    setCurDate(value)
    setSearchParams((o: API.PageParams) => ({
      ...o,
      betweenMap:
        value === 'none'
          ? undefined
          : {
              approvedDate: [
                dayjs()
                  .subtract(1, value as any)
                  .format('YYYY-MM-DD'),
                dayjs().format('YYYY-MM-DD HH:mm:ss')
              ]
            }
    }))
  }

  const handleOpen = (e: any) => {
    e.preventDefault()
    form.setFieldsValue({
      sort: dtoSort,
      date: curDate
    })

    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleFinish = (formData: { date: string; sort: string }) => {
    setCurDate(formData.date)
    setDtoSort(formData.sort)
    setSearchParams((o: API.PageParams) => ({
      ...o,
      dto: {
        ...o.dto,
        sort: formData.sort === 'all' ? undefined : formData.sort
      },
      betweenMap:
        formData.date === 'none'
          ? undefined
          : {
              approvedDate: [
                dayjs()
                  .subtract(1, formData.date as any)
                  .format('YYYY-MM-DD'),
                dayjs().format('YYYY-MM-DD HH:mm:ss')
              ]
            }
    }))
    handleClose()
    return Promise.resolve()
  }

  return (
    <>
      <div className={filterBarClassName}>
        <Space split={<Divider type='vertical' />}>
          {sortItem.map(item => (
            <div
              key={item.value}
              onClick={() => handleFilter(item.value)}
              className={classNames('filter-bar-btn', curSort === item.value && 'active')}
            >
              {item.label}
            </div>
          ))}
        </Space>

        <div className='filter-bar-right'>
          <a onClick={handleOpen} className='filter-bar-right-btn'>
            <FilterOutlined />
          </a>

          <Select
            size='small'
            value={curDate}
            options={dateOptions}
            onChange={handleSelect}
            className='filter-bar-right-select'
          />
        </div>
      </div>

      <Drawer
        width={300}
        open={open}
        onClose={handleClose}
        title={<FormattedMessage id='pages.form.filter' />}
      >
        <ProForm
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          submitter={{
            render: (props, dom) => dom[1]
          }}
        >
          <ProFormSelect
            name='sort'
            allowClear={false}
            options={sortOptions}
            label={<FormattedMessage id='pages.form.sort' />}
          />
          <ProFormSelect
            name='date'
            allowClear={false}
            options={dateOptions}
            label={<FormattedMessage id='pages.form.date' />}
          />
        </ProForm>
      </Drawer>
    </>
  )
}

export default FilterBar
