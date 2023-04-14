/**
 * @description: 获取文章目录，务必放在 userLayoutEffect 中使用
 * @param {String} targetID: 目标节点下面的标题
 */
export const getArticleDirectory = (targetId: string) => {
  const nodeList = Array.from(
    document.querySelectorAll(`
      ${targetId} h1,
      ${targetId} h2,
      ${targetId} h3,
      ${targetId} h4,
      ${targetId} h5,
      ${targetId} h6
    `)
  )

  const anchorData: any[] = []

  const pushData = (pre, obj) => {
    if (!pre) {
      anchorData.push(obj)
      return obj
    }

    // 等级小说明标签大
    if (pre.level < obj.level) {
      // 最多到第三层
      if (pre.rank <= 2) {
        obj.parent = pre
        obj.rank = pre.rank + 1
        pre.children.push(obj)
      } else {
        return pre
      }
    } else if (pre.level === obj.level) {
      obj.parent = pre.parent
      obj.rank = pre.rank

      if (pre.parent) {
        pre.parent.children?.push(obj)
      } else {
        // 说明到顶了
        anchorData.push(obj)
      }
    } else {
      // 直接递归，看上一级是否比它小
      return pushData(pre.parent, obj)
    }

    return obj
  }

  nodeList.reduce((pre, next, index) => {
    const id = 'header-' + index
    next.setAttribute('id', id)

    const obj = {
      key: index,
      href: '#' + id,
      rank: 1,
      level: Number(next.nodeName.substring(1, 2)),
      title: next.innerHTML,
      parent: undefined,
      children: []
    }

    return pushData(pre, obj)
  }, '')

  return anchorData
}

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
