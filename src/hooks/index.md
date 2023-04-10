<!--
 * @Author: dingyun
 * @Date: 2021-12-25 13:31:56
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-01 14:48:52
 * @Description:
-->

# 自定义 Hook

这里列举了一些自定义 Hook 的使用方法

## useFormItemFillHint 表单项必填提示

只支持 form 的国际化字符，只需要传后面一串即可，例如`pages.form.itemTitle`只需要传`itemTitle`

详情看以下实例

```tsx
import useFormItemFillHint from '@/hooks/useFormItemFillHint'
import { useIntl } from '@umijs/max'
import { Form, Input } from 'antd'
import React from 'react'

export default (): React.ReactNode => {
  const intl = useIntl()
  // 先初始化
  const formItemFillHint = useFormItemFillHint()

  return (
    <Form>
      <Form.Item
        label={intl.formatMessage({ id: 'pages.form.itemTitle' })}
        name='title'
        rules={[{ required: true, message: formItemFillHint('form.itemTitle') }]} // 使用时传入字符
      >
        <Input placeholder={intl.formatMessage({ id: 'pages.form.inputMsg' })} />
      </Form.Item>
    </Form>
  )
}
```

## useFormatTime 格式化时间显示，比如几秒前、几天前

```tsx
import useFormatTime from '@/hooks/useFormatTime'
import React from 'react'

export default (): React.ReactNode => {
  // 小于 7 天的显示几天前，超过的显示具体的时间。默认为 7
  const formatTime = useFormatTime(7)

  return formatTime('2023-03-31T10:18:24.841Z', 7)
}
```

## usePaginationItem 分页器渲染

```tsx
import usePaginationItem from '@/hooks/usePaginationItem'
import React from 'react'

export default (): React.ReactNode => {
  const itemRender = usePaginationItem()

  return <List pagination={{ itemRender }} />
}
```

## useParamsRedirect 带参重定向

```tsx
import useParamsRedirect from '@/hooks/useParamsRedirect'
import React from 'react'

export default (): React.ReactNode => {
  const paramsRedirect = useParamsRedirect()

  return <div onClick={() => paramsRedirect()} />
}
```
