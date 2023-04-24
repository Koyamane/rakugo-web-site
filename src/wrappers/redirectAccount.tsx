import { Navigate, useModel } from '@umijs/max'

export default () => {
  if (!localStorage.getItem('token')) {
    return <Navigate to='/user/login' />
  }

  const { initialState } = useModel('@@initialState')
  // 重定向到个人中心
  return <Navigate to={`/account/center/${initialState?.currentUser?.userId}`} />
}
