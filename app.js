// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login success code ' + res.code)
        var loginCode = res.code
        wx.getUserInfo({
          lang: 'zh_CN',
          success(res) {
            console.log('user info ' + res.userInfo.city +
              ' ' + res.userInfo.province)
            let app = getApp()
            wx.request({
              url: app.globalData.baseUrl + '/wx/obtainSession',
              header: {
                'token': app.globalData.token,
                'content-type': 'application/json'
              },
              data: {
                loginCode: loginCode,
                rawData: res.rawData,
                signature: res.signature,
                encryptedData: res.encryptedData,
                iv: res.iv,
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                gender: res.userInfo.gender,
                country: res.userInfo.gender,
                province: res.userInfo.province,
                city: res.userInfo.city
              },
              success(res) {
                console.log('obtainSession success res ' + res.data.data)
                app.globalData.token = res.data.data
              },
              fail(res) {
                console.log('obtainSession fail res ' + res.errMsg)
              }
            })
          },
          fail(res) {
            console.log('get userinfo fail ' + res.errMsg)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:8081',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmdWppYW4iLCJpYXQiOjE2MTAxODQ2NzIsImV4cCI6MTYxMDI3MTA3Mn0.WNOnfMFHJjZP2l8pcnEt3FYn2c4RRiLo7SODtirMoU_yYIZxWhwaCwPA-Jn3a_C7uTKjDtwvQwNbGioPiP6Lgw'
  }
})