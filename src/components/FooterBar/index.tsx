/*
 * @Author: dingyun
 * @Date: 2023-04-29 20:34:52
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-08 18:40:43
 * @Description:
 */
import { useToken } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import React, { useLayoutEffect } from 'react'

interface FooterBarProps {
  mobileMode?: boolean
  extra?: React.ReactNode
  children?: React.ReactNode
}

const FooterBar: React.FC<FooterBarProps> = React.memo(({ mobileMode, extra, children }) => {
  const { token } = useToken()
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
        maxWidth: (token as any).pageMaxWidth,

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

  const appendHeightDom = () => {
    requestAnimationFrame(() => {
      const barNode = document.getElementById('footer-bar')
      const barDomNode = document.getElementById('footer-bar-dom')
      if (window.innerWidth < token.screenLG) {
        barDomNode?.setAttribute('style', `height: ${barNode?.offsetHeight}px; display: block`)
      } else {
        barDomNode?.setAttribute('style', `height: ${barNode?.offsetHeight}px; display: none`)
      }
    })
  }

  useLayoutEffect(() => {
    const barNode = document.getElementById('footer-bar')
    const barDomNode = document.createElement('div')
    barDomNode.id = 'footer-bar-dom'
    barDomNode.style.height = barNode?.offsetHeight + 'px'
    const antProNode = document.querySelector('.ant-pro')
    antProNode?.appendChild(barDomNode)
    window.addEventListener('resize', appendHeightDom)

    return () => {
      window.removeEventListener('resize', appendHeightDom)
      const barDomNode = document.getElementById('footer-bar-dom')
      barDomNode?.remove()
    }
  }, [])

  return (
    <div id='footer-bar' className={footerBarClassName}>
      <div className='footer-bar-content'>
        <div className='footer-bar-content-left'>{extra}</div>
        <div className='footer-bar-content-right'>{children}</div>
      </div>
    </div>
  )
})

export default FooterBar
