const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  perms: state => state.permission.perms
}

export default getters
