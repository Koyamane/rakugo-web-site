// 中文当作两个长度
export const getStrLen = (str: string) => {
  if (str === null) return 0
  if (typeof str !== 'string') {
    str = str + ''
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}

export const formatTableParams = (
  params: Record<string, any>,
  sortObj: Record<string, string>,
  dtoArr: string[] = [],
  searchArr: string[] = []
) => {
  const sort = {}
  const dto = {}
  const searchMap: any = {}

  for (const key in sortObj) {
    if (Object.prototype.hasOwnProperty.call(sortObj, key)) {
      const element = sortObj[key]
      sort[key] = element === 'ascend' ? 1 : -1
    }
  }

  for (const key in params) {
    if (
      Object.prototype.hasOwnProperty.call(params, key) &&
      key !== 'current' &&
      key !== 'pageSize'
    ) {
      const element = params[key]

      if (dtoArr.includes(key)) {
        dto[key] = element
      }

      if (searchArr.includes(key)) {
        searchMap[key] = {
          opt: 'LIKE',
          value: element
        }
      }
    }
  }

  return {
    dto,
    searchMap,
    current: params.current,
    pageSize: params.pageSize,
    sort
  }
}

// file 转 bse64
export const fileToBase64 = async (file: File) => {
  return await new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      resolve(e?.target?.result)
    }
  })
}

let lastTime = new Date().getTime()
/**
 * @description: 节流
 */
export function throttle(callback: () => void, delay: number = 500) {
  return () => {
    const nowTime = new Date().getTime()
    if (nowTime - lastTime > delay) {
      callback()
      lastTime = nowTime
    }
  }
}

let timer: any = null
/**
 * @description: 防抖(延迟执行)
 * @param {Function} callback 回调
 * @param {number} delay 延迟
 * @return {Function} 返回一个函数，用的时候请使用自执行函数
 */
export function debounce(callback: () => void, delay: number = 500) {
  return () => {
    clearTimeout(timer)
    timer = setTimeout(callback, delay)
  }
}

let debounceNowTimer: any = null
let debounceNowFlag: boolean = true
/**
 * @description: 防抖(立即执行)
 * @param {Function} callback 回调
 * @param {number} delay 延迟
 * @return {Function} 返回一个函数，用的时候请使用自执行函数
 */
export function debounceNow(callback: () => void, delay: number = 500) {
  return () => {
    clearTimeout(debounceNowTimer)
    if (debounceNowFlag) {
      callback()
      debounceNowFlag = false
    }
    debounceNowTimer = setTimeout(() => {
      debounceNowFlag = true
    }, delay)
  }
}
