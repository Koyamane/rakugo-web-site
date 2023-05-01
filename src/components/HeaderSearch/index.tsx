/*
 * @Author: dingyun
 * @Date: 2023-04-22 13:42:42
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-01 21:25:13
 * @Description:
 */
import { debounce, unique } from '@/utils/tools'
import { SearchOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { history, useIntl } from '@umijs/max'
import { AutoComplete, Input, InputRef } from 'antd'
import classNames from 'classnames'
import React, { useMemo, useRef, useState } from 'react'

export type HeaderSearchProps = {
  className?: string
}

interface OptionType {
  label: React.ReactNode
  options: {
    label: React.ReactNode
    value?: string | number | null
  }[]
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({ className }) => {
  const intl = useIntl()
  const inputRef = useRef<InputRef | null>(null)
  const [searchMode, setSearchMode] = useState(false)
  const [options, setOptions] = useState<OptionType[]>([])

  const searchClassName = useEmotionCss(({ token }) => ({
    display: 'inline-flex',

    '.pc-header-search': {
      transition: 'width 0.3s',
      width: searchMode ? '400px' : '200px'
    },

    '.mobile-header-search': {
      display: 'none',
      color: token.colorTextDescription
    },

    input: {
      color: token.colorTextDescription
    },

    [`@media screen and (max-width: ${token.screenMD}px)`]: {
      '.pc-header-search': {
        display: 'none'
      },
      '.mobile-header-search': {
        display: 'inline-flex'
      }
    }
  }))

  const clearClassName = useEmotionCss(() => ({
    display: 'flex',
    lineHeight: '22px',
    justifyContent: 'space-between'
  }))

  const clearAllItem = useMemo(() => {
    return (
      <div className={clearClassName}>
        <span>{intl.formatMessage({ id: 'pages.form.search.history' })}</span>
        <a
          onClick={(e: any) => {
            e.preventDefault()
            setOptions([])
            localStorage.removeItem('searchHhistory')
          }}
        >
          {intl.formatMessage({ id: 'pages.form.clear' })}
        </a>
      </div>
    )
  }, [intl.locale])

  // 这里这么设置，就是为了让下拉列表能晚点获取数据，从而达到等宽
  const onSetSearchMode = (flag: boolean) => {
    if (!flag) {
      setOptions([])

      debounce(() => {
        setSearchMode(false)
      }, 100)()
      return
    }

    setSearchMode(true)
    debounce(() => {
      let searchHhistoryArr = []

      try {
        searchHhistoryArr = JSON.parse(localStorage.getItem('searchHhistory') || '[]')
      } catch (error) {
        console.log(error)
      }

      setOptions([
        {
          label: clearAllItem,
          options: Array.isArray(searchHhistoryArr) ? searchHhistoryArr : []
        }
      ])
    }, 300)()
  }

  const onSearch = (value: string, e: any) => {
    e.stopPropagation()
    if (!value) return

    let searchHhistoryArr = []

    try {
      searchHhistoryArr = JSON.parse(localStorage.getItem('searchHhistory') || '[]')
    } catch (error) {
      console.log(error)
    }

    const arr = unique([
      { value, label: value },
      ...(Array.isArray(searchHhistoryArr) ? searchHhistoryArr : [])
    ])

    localStorage.setItem('searchHhistory', JSON.stringify(arr))

    inputRef?.current?.blur()
    // 调用搜索
    history.push('/search?query=' + value)
  }

  const onSelect = (value: string) => {
    inputRef?.current?.blur()
    // 调用搜索
    history.push('/search?query=' + value)
  }

  const goSearch = () => {
    // 为了让苹果手机能正常弹出键盘
    let oInput = document.createElement('input')
    oInput.id = 'input-autofocus-dom'
    oInput.setAttribute('style', 'opacity: 0')
    document.querySelector('.page-layout')?.insertAdjacentElement('afterbegin', oInput)
    oInput.focus()
    history.push('/search')
  }

  return (
    <div className={classNames(searchClassName, className)}>
      <SearchOutlined className='mobile-header-search' onClick={goSearch} />

      <AutoComplete
        key='AutoComplete'
        options={options}
        onSelect={onSelect}
        className='pc-header-search'
        onChange={(completeValue, option: any) => {
          // 防止回显 id
          if (option?.value) return
        }}
      >
        <Input.Search
          ref={inputRef}
          onSearch={onSearch}
          enterButton={searchMode}
          onFocus={() => onSetSearchMode(true)}
          onBlur={() => onSetSearchMode(false)}
          aria-label={intl.formatMessage({ id: 'pages.form.search' })}
          placeholder={intl.formatMessage({ id: 'pages.form.search' })}
        />
      </AutoComplete>
    </div>
  )
}

export default HeaderSearch
