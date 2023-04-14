import { useEmotionCss } from '@ant-design/use-emotion-css'
import React from 'react'

interface FooterBarProps {
  mobileMode?: boolean
  extra?: React.ReactNode
  children?: React.ReactNode
}

const FooterBar: React.FC<FooterBarProps> = React.memo(({ mobileMode, extra, children }) => {
  const footerBarClassName = useEmotionCss(({ token }) => {
    return {
      width: '100%',
      position: 'fixed',
      bottom: '0',
      left: '0',
      color: token.colorText,
      boxShadow: token.boxShadow,
      paddingBlock: token.paddingXXS,
      background: token.colorBgContainer,
      display: mobileMode ? 'none' : 'block',

      '.footer-bar-content': {
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        paddingInline: token.paddingMD,
        justifyContent: 'space-between',
        maxWidth: token.pageMaxWidth,

        '&-left': {
          flex: 'auto',
          overflow: 'hidden'
        },

        '&-right': {
          flexShrink: '0'
        }
      },

      [`@media screen and (max-width: ${token.screenLG}px)`]: {
        display: 'block'
      }
    }
  })

  return (
    <div className={footerBarClassName}>
      <div className='footer-bar-content'>
        <div className='footer-bar-content-left'>{extra}</div>
        <div className='footer-bar-content-right'>{children}</div>
      </div>
    </div>
  )
})

export default FooterBar
