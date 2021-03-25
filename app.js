// app.js
import config from './config'
App({
  onLaunch() {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this

    wx.showLoading({
      title: '',
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login success code ' + res.code)
        
        let app = getApp()
        var loginCode = res.code
        app.globalData.loginCode = res.code

        wx.getUserInfo({
          lang: 'zh_CN',
          success(res) {
            console.log('user info ' + res.userInfo.city +
              ' ' + res.userInfo.province)
            that.globalData.userInfo = res.userInfo            

            wx.request({
              url: app.globalData.baseUrl + '/wx/obtainSession',
              method: 'POST',
              header: {
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
                console.log('obtainSession success res ', res.data.data)
                app.globalData.token = res.data.data
              },
              fail(res) {
                console.error('obtainSession fail res ' + res.errMsg)
              },
              complete(res) {
                wx.hideLoading({
                  success: (res) => {},
                })
              }
            })
          },
          fail(res) {
            console.error('get userinfo fail ' + res.errMsg)
            wx.hideLoading({
              success: (res) => {},
            })
            
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '授权失败，请前往[我的]页面完成授权登录',
              success (res) {
              }
            })            
          },
        })
      },
      fail(res) {
        console.error('wx.login fail: ' + res.errMsg)
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '授权失败，请前往[我的]页面完成授权登录',
          success (res) {
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
    loginCode: '',
    cityCode: '5101', //todo 暂定成都
    cityName: '成都',
    userInfo: null,
    lng: 103.92377, // todo 暂定成都
    lat: 30.57447, // todo 暂定成都    
    baseUrl: 'https://fang.bigdnsoft.cn/fpp',
    token: '',
  }
})