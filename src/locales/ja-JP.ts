import account from './ja-JP/account'
import component from './ja-JP/component'
import form from './ja-JP/form'
import globalHeader from './ja-JP/globalHeader'
import menu from './ja-JP/menu'
import pages from './ja-JP/pages'
import pwa from './ja-JP/pwa'
import settingDrawer from './ja-JP/settingDrawer'
import settings from './ja-JP/settings'

export default {
  'navBar.lang': '言語',
  'layout.user.link.help': 'ヘルプ',
  'layout.user.link.privacy': 'プライバシー',
  'layout.user.link.terms': '利用規約',
  'app.copyright.produced': '小山音出品',
  'app.preview.down.block': 'このページをローカルプロジェクトにダウンロードしてください',
  'app.welcome.link.fetch-blocks': '',
  'app.welcome.link.block-list': '',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...account,
  ...form
}
