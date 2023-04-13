import { Link, useIntl } from '@umijs/max'
import { Button, Result } from 'antd'

export default () => {
  const intl = useIntl()

  return (
    <Result
      status='404'
      title='404'
      style={{ background: 'none' }}
      subTitle={intl.formatMessage({
        id: 'pages.exception.404Title',
        defaultMessage: '很抱歉，您访问的页面不存在。'
      })}
      extra={
        <Link to='/'>
          <Button type='primary'>
            {intl.formatMessage({ id: 'pages.home.backHome', defaultMessage: '回首页' })}
          </Button>
        </Link>
      }
    />
  )
}
