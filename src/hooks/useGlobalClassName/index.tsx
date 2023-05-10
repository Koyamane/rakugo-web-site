/*
 * @Author: dingyun
 * @Date: 2023-04-21 22:16:16
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-10 11:02:03
 * @Description:
 */

import sideBg from '@/assets/kiniyorikakaruonnnanoko.jpg'
import { useEmotionCss } from '@ant-design/use-emotion-css'

const useGlobalClassName = () => {
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
        marginInlineStart: token.marginMD,
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
        marginBlockStart: token.marginMD,
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

  const contentListClassName = useEmotionCss(({ token }) => {
    return {
      color: token.colorText,

      '.content-list-item': {
        display: 'flex',
        paddingBlock: token.paddingSM,
        justifyContent: 'space-between',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,

        '&-left': {
          flex: '1',
          display: 'flex',
          color: token.colorTextDescription,
          flexDirection: 'column',
          justifyContent: 'space-between',

          '&-userInfo': {
            wordBreak: 'break-all'
          },

          '&-title': {
            fontSize: token.fontSizeLG,
            fontWeight: token.fontWeightStrong,
            marginBlock: token.marginXS,

            a: {
              color: token.colorTextHeading,
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          },

          '&-body': {
            display: '-webkit-box', // 对象作为伸缩盒子模型展示
            flex: 1,
            overflow: 'hidden',
            color: token.colorText,
            marginBlockEnd: token.marginXXS,
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            WebkitBoxOrient: 'vertical', // 设置或检索伸缩盒子对象的子元素的排列方式
            WebkitLineClamp: '2' // 在第几行上加 ...
          },

          '&-actions-active': {
            color: token.colorPrimaryText
          }
        },

        '&-right': {
          flexShrink: 0,
          borderRadius: token.borderRadius,
          overflow: 'hidden',
          position: 'relative',
          width: '200px',
          minHeight: '133px',
          cursor: 'pointer',
          marginInlineStart: token.marginXS,

          '&-cover': {
            borderRadius: token.borderRadius,
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)'
          }
        },

        '.search-highlight-text': {
          color: token.colorPrimaryTextActive
        }
      },

      // 放后面权重高，所以媒体查询要放后面来
      [`@media screen and (max-width: ${token.screenMD}px)`]: {
        '.content-list-item': {
          flexDirection: 'column-reverse',
          '&-right': {
            width: '100%',
            minHeight: '180px',
            marginInline: 'auto',
            marginBlockEnd: token.marginSM
          }
        }
      }
    }
  })

  const noMoreClassName = useEmotionCss(({ token }) => {
    return {
      fontSize: token.fontSizeSM,
      paddingBlock: token.paddingSM,
      color: token.colorTextDescription,
      textAlign: 'center'
    }
  })

  const infiniteScrollClassName = useEmotionCss(({ token }) => {
    return {
      flex: '1',
      paddingInline: token.paddingMD,
      borderRadius: token.borderRadius,
      background: token.colorBgContainer
    }
  })

  return {
    noMoreClassName,
    homeLayoutClassName,
    contentListClassName,
    infiniteScrollClassName
  }
}

export default useGlobalClassName
