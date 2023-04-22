/*
 * @Author: dingyun
 * @Date: 2023-04-12 19:25:38
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-16 22:35:09
 * @Description:
 */
import { FormOutlined } from '@ant-design/icons'
import { useToken } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, NavLink, SelectLang as UmiSelectLang, useModel } from '@umijs/max'
import { Popover } from 'antd'
import { useMemo } from 'react'

export type SiderTheme = 'light' | 'dark'

export const ThemeIcon = () => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const isRealDrak = useMemo(() => {
    return initialState?.settings?.navTheme === 'light'
  }, [initialState?.settings])

  const changeTheme = () => {
    const navTheme = initialState?.settings?.navTheme === 'light' ? 'realDark' : 'light'
    localStorage.setItem('navTheme', navTheme)
    setInitialState({
      ...initialState,
      settings: {
        ...initialState?.settings,
        navTheme
      }
    })
  }

  const themeIconClassName = useEmotionCss(() => ({
    display: 'inline-flex'
  }))

  return (
    <span onClick={changeTheme} className={themeIconClassName}>
      {isRealDrak ? (
        <svg
          className='icon icon-sun'
          focusable='false'
          aria-hidden='true'
          viewBox='0 0 1024 1024'
          width='1em'
          height='1em'
          fill='currentColor'
        >
          <path d='M512 853.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333334 0v-85.333333a42.666667 42.666667 0 0 1 42.666667-42.666667z m301.696-99.968l60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667 60.330667l-60.330667-60.330667a42.666667 42.666667 0 0 1 60.330667-60.330667z m-543.061333 0a42.666667 42.666667 0 0 1 0 60.330667L210.346667 874.026667a42.666667 42.666667 0 1 1-60.330667-60.330667l60.330667-60.330667a42.666667 42.666667 0 0 1 60.330666 0zM512 256a256 256 0 1 1 0 512 256 256 0 0 1 0-512z m0 85.333333a170.112 170.112 0 0 0-120.661333 50.005334A170.112 170.112 0 0 0 341.333333 512c0 47.146667 19.114667 89.813333 50.005334 120.661333A170.112 170.112 0 0 0 512 682.666667a170.112 170.112 0 0 0 120.661333-50.005334A170.112 170.112 0 0 0 682.666667 512a170.112 170.112 0 0 0-50.005334-120.661333A170.112 170.112 0 0 0 512 341.333333z m469.333333 128a42.666667 42.666667 0 0 1 0 85.333334h-85.333333a42.666667 42.666667 0 0 1 0-85.333334h85.333333zM128 469.333333a42.666667 42.666667 0 0 1 0 85.333334H42.666667a42.666667 42.666667 0 0 1 0-85.333334h85.333333z m746.026667-319.36a42.666667 42.666667 0 0 1 0 60.330667l-60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667-60.330667l60.330667-60.330667a42.666667 42.666667 0 0 1 60.330667 0z m-663.722667 0l60.330667 60.330667A42.666667 42.666667 0 0 1 210.346667 270.634667L149.973333 210.346667a42.666667 42.666667 0 1 1 60.330667-60.330667zM512 0a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333334 0V42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z'></path>
        </svg>
      ) : (
        <svg
          className='icon icon-moon'
          focusable='false'
          aria-hidden='true'
          viewBox='0 0 1024 1024'
          width='1em'
          height='1em'
          fill='currentColor'
        >
          <path d='M512 981.312A469.632 469.632 0 0 1 42.688 512 469.632 469.632 0 0 1 512 42.688h17.28c18.816 0 36.096 12.544 43.904 31.36a45.76 45.76 0 0 1-12.544 51.84 242.304 242.304 0 0 0-84.736 183.68 241.856 241.856 0 0 0 241.728 241.664c70.656 0 136.576-31.36 183.68-84.736a49.024 49.024 0 0 1 51.776-14.144c18.816 6.272 31.36 23.552 31.36 42.368V512c-3.136 259.008-213.44 469.312-472.448 469.312zM420.928 147.84A375.488 375.488 0 0 0 136.832 512 375.168 375.168 0 0 0 512 887.168a375.488 375.488 0 0 0 364.16-284.16 332.608 332.608 0 0 1-160.128 40.832A336.32 336.32 0 0 1 380.16 307.968c0-56.512 14.08-111.488 40.768-160.128z'></path>
        </svg>
      )}
    </span>
  )
}

export const PostArticle: React.FC = () => {
  const postArticleClassName = useEmotionCss(({ token }) => ({
    display: 'inline-flex',
    color: token.colorTextDescription,
    '&:hover': {
      color: token.colorTextDescription
    }
  }))

  return (
    <Popover content={<FormattedMessage id='menu.post.article' />}>
      <NavLink to='/post/article' className={postArticleClassName}>
        <FormOutlined />
      </NavLink>
    </Popover>
  )
}

export const SelectLang: React.FC<{ className?: string }> = ({ className }) => {
  const { token } = useToken()

  const selectLangStyle = {
    fontSize: token.fontSizeXL,
    padding: token.paddingXS - 2
  }

  return <UmiSelectLang className={className} style={selectLangStyle} reload={false} />
}
