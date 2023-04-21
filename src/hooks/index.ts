/**
 * 这个文件作为 hook 的目录
 * 目的是统一管理对外输出的 hook，方便分类
 */
import useFormatTime from './useFormatTime'
import useFormItemFillHint from './useFormItemFillHint'
import useGlobalHooks from './useGlobalHooks'
import useGoRedirect from './useGoRedirect'
import usePaginationItem from './usePaginationItem'
import useParamsRedirect from './useParamsRedirect'
import useVerifyFileSize from './useVerifyFileSize'

export {
  useFormItemFillHint,
  useFormatTime,
  usePaginationItem,
  useParamsRedirect,
  useGoRedirect,
  useVerifyFileSize,
  useGlobalHooks
}
