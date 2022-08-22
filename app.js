// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'

App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0
  },
  onLaunch: async function () {
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio

    // 用户默认登陆
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期
    // const checkResult = await checkToken(token)
    const checkResult = { message: "Success" }
    // const isSessionExpire = await checkSession()
    const isSessionExpire = true
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },
  loginAction: async function () {
    // 获取code
    const code = await getLoginCode()
    // 
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
