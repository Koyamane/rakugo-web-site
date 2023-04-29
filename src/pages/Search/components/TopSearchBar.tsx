/*
 * @Author: dingyun
 * @Date: 2023-04-22 13:42:42
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-29 15:34:43
 * @Description:
 */
import { debounce, unique } from '@/utils/tools'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { history, useIntl } from '@umijs/max'
import type { InputRef } from 'antd'
import { AutoComplete, Input } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'

export type TopSearchBarProps = {
  className?: string
  setSearchParams?: React.Dispatch<React.SetStateAction<API.PageParams>>
}

interface OptionType {
  label: React.ReactNode
  options: {
    label: React.ReactNode
    value?: string | number | null
  }[]
}

const TopSearchBar: React.FC<TopSearchBarProps> = ({ className }) => {
  const intl = useIntl()
  const inputRef = useRef<InputRef | null>(null)
  const [options, setOptions] = useState<OptionType[]>([])

  const searchClassName = useEmotionCss(({ token }) => ({
    '&.search-page-top-bar': {
      display: 'none',
      marginBlockEnd: token.marginMD,

      '.ant-select': {
        width: '100%'
      }
    },

    input: {
      color: token.colorTextDescription
    },

    [`@media screen and (max-width: ${token.screenMD}px)`]: {
      '&.search-page-top-bar': {
        display: 'block'
      }
    }
  }))

  const clearClassName = useEmotionCss(() => ({
    display: 'flex',
    lineHeight: '22px',
    justifyContent: 'space-between'
  }))

  const clearSearchHistory = (e: any) => {
    e.preventDefault()
    setOptions([])
    localStorage.removeItem('searchHhistory')
  }

  const clearAllItem = useMemo(() => {
    return (
      <div className={clearClassName}>
        <span>{intl.formatMessage({ id: 'pages.form.search.history' })}</span>
        <a onClick={clearSearchHistory}>{intl.formatMessage({ id: 'pages.form.clear' })}</a>
      </div>
    )
  }, [intl.locale])

  const onChange = (e: any) => {
    debounce(() => {
      if (e.target.value) {
        setOptions([])
        return
      }

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
    }, 200)()
  }

  const onSearch = (value: string) => {
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

    setTimeout(() => {
      // 因为点击搜索图标也会触发，而且会聚焦，所以这里延迟失焦
      inputRef?.current?.blur()
      setOptions([])
    })

    history.push('/search?query=' + value)
  }

  const onSelect = (value: string) => {
    inputRef?.current?.blur()
    setOptions([])
    history.push('/search?query=' + value)
  }

  useEffect(() => {
    // 因为苹果手机不能自动对焦，所以用这个 input 来实现，现在要清空它
    document.getElementById('input-autofocus-dom')?.remove()
  }, [])

  return (
    <div className={classNames(searchClassName, className, 'search-page-top-bar')}>
      <AutoComplete
        autoFocus
        options={options}
        onSelect={onSelect}
        onChange={(completeValue, option: any) => {
          // 防止回显 id
          if (option?.value) return
        }}
      >
        <Input.Search
          enterButton
          ref={inputRef}
          onSearch={onSearch}
          onChange={onChange}
          onFocus={onChange}
          aria-label={intl.formatMessage({ id: 'pages.form.search' })}
          placeholder={intl.formatMessage({ id: 'pages.form.search' })}
        />
      </AutoComplete>
    </div>
  )
}

export default TopSearchBar
