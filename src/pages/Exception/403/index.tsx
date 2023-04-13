import { Link, useIntl } from '@umijs/max'
import { Button, Result } from 'antd'

export default () => {
  const intl = useIntl()

  return (
    <Result
      status='403'
      title='403'
      style={{ background: 'none' }}
      subTitle={intl.formatMessage({
        id: 'pages.exception.403Title',
        defaultMessage: '很抱歉，您没有访问此页面的权限。'
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
