// app.js
App({
  onLaunch() {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this

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
            that.globalData.userInfo = res.userInfo
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
    
    wx.getLocation({
      altitude: false,
      isHighAccuracy: true,
      type: 'gcj02',
      success(res) {
        console.log('location lng: ' + res.longitude + ' lat: ' + res.latitude)
        that.globalData.lng = res.longitude
        that.globalData.lat = res.latitude
      },
      fail(res) {
        console.error('location error ' + res.errMsg)
      }
    })

    wx.getSystemInfo({
      success: e => {
        this.globalData.screenWidth = e.screenWidth * e.pixelRatio
        this.globalData.screenHeight = e.screenHeight * e.pixelRatio
        this.globalData.pixelRatio = e.pixelRatio
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
    baseUrl: 'https://47.107.38.58/fpp',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1YmFiNjU2MS1lZDhmLTRiMDQtYTQyOC1iNTc4M2VlNmMxZmQiLCJpYXQiOjE2MTYxNjU5NzMsImV4cCI6MTYxNjc3MDc3M30.n6iNHtUGlYifq-5FWwvYfaQ8toRB4hawhoLV3Hv8_MS7MdQKaaATvuIZ8BzvHiekOsBPNqzLbC_PPruRMlxFcQ',
  }
})