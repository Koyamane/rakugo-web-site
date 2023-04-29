import { Helmet, Link, useIntl } from '@umijs/max'
import { Button, Result } from 'antd'

export default () => {
  const intl = useIntl()

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'pages.exception.500Title' })}</title>
      </Helmet>

      <Result
        status='500'
        title='500'
        style={{ background: 'none' }}
        subTitle={intl.formatMessage({
          id: 'pages.exception.500Title',
          defaultMessage: '很抱歉，服务器正在报告错误。'
        })}
        extra={
          <Link to='/'>
            <Button type='primary'>
              {intl.formatMessage({ id: 'pages.home.backHome', defaultMessage: '回首页' })}
            </Button>
          </Link>
        }
      />
    </>
  )
}
