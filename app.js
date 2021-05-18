// app.js
import config from './config'
import eventbus from './utils/eventbus'

let initWss = function (token, app) {

  var wss = app.globalData.wss
  if (wss != null && wss != undefined) {
    wss.close({
      success(res) {

      },
      fail(res) {

      }
    })
  }

  wss = wx.connectSocket({
    url: app.globalData.wssUrl + token,
    header: {
      'content-type': 'application/json'
    },
  })

  app.globalData.wss = wss

  wss.onOpen(function (res) {
    console.log('wss on Open', res)
  })

  wss.onError(function (error) {
    console.error('wss on Error', error)
  })

  wss.onClose(function (res) {
    console.log('wss on Close', res)
  })

  wss.onMessage(function (res) {
    var data = JSON.parse(res.data)
    console.log('wss on Message', data)
    switch (data.type) {
      case 0: // 新消息
        app.globalData.unReadMsgNum++
        app.globalData.bus.emit('msgNum')
        app.globalData.bus.emit('newMsg', JSON.parse(JSON.stringify(data.content)))
        app.globalData.bus.emit('dialogNewMsg', data.content)
        break;
      default:
        console.error('wss unknown message type: ' + data.type)
        break;
    }
  })
}

// 相当于获取未读数了
let getRecentDialogs = function (app) {

  wx.request({
    url: app.globalData.baseUrl + '/msg/getRecentDialogs',
    header: {
      'token': app.globalData.token,
      'content-type': 'application/json'
    },
    data: {
      pageIndex: 0,
      pageSize: 100
    },
    success(res) {
      if (res.data.code != 0) {
        console.error('getRecentDialogs fail', res)
        wx.showToast({
          title: '数据错误 ' + res.data.msg,
          icon: 'none'
        })
        return
      }

      if (res.data.data == null || res.data.data.length == 0) {
        console.error('getRecentDialogs res.data.data == null || res.data.data.length == 0')
        return
      }

      var dialogs = res.data.data

      var unReadCount = 0
      for (var i = 0; i < dialogs.length; i++) {
        unReadCount += dialogs[i].unread
      }
      app.globalData.unReadMsgNum = unReadCount
      app.globalData.bus.emit('msgNum')
    },
    fail(res) {
      console.error('getRecentDialogs fail', res)
      wx.showToast({
        title: '数据错误',
        icon: 'none'
      })
    }
  })
}

let register = function(loginCode, res) {

  wx.showLoading({
    title: '',
  })

  var app = getApp()

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

      if (res.data.code != 0) {
        console.error('register code != 0', res)
        wx.showToast({
          title: '注册失败',
          icon: 'none'
        })
        return
      }

      app.globalData.token = res.data.data.token
      app.globalData.uid = res.data.data.uid
      appjs.initWss(res.data.data.token, app)
      that.setData({
        userInfo: userInfo
      })
    },
    fail(res) {
      console.error('register obtainSession fail res ' + res.errMsg)
      wx.showToast({
        title: '注册失败',
        icon: 'none'
      })
    },
    complete(res) {
      wx.hideLoading({
        success: (res) => {},
      })
    }
  })
}

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

        wx.hideLoading({
          success: (res) => {},
        })

        wx.request({
          url: app.globalData.baseUrl + '/wx/obtainSession',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            loginCode: loginCode
          },
          success(res) {

            if (res.data.code != 0) { // 需要注册

              wx.showModal({
                title: '提示',                
                content: "您需要授权注册",
                confirmText: "授权",
                success (res) {
                  if (res.confirm) {
                    wx.getUserProfile({
                      lang: 'zh_CN',
                      desc: '获取用户信息',
                      success(res) {
                        register(loginCode, res)
                      },
                      fail(res) {
                        wx.showToast({
                          title: '注册失败',
                          icon: 'none'
                        })
                      }
                    })
                  } else if (res.cancel) {
                    
                  }
                }
              })
              return
            }

            console.log('obtainSession success res ', res.data.data)
            
            app.globalData.token = res.data.data.token
            app.globalData.uid = res.data.data.uid

            let respData = res.data.data

            app.globalData.userInfo = {
              nickName: respData.nickName,
              avatarUrl: respData.avatar,
              gender: respData.gender
            }

            initWss(res.data.data.token, app)
            getRecentDialogs(app)
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
        console.error('wx.login fail: ' + res.errMsg)
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '授权失败，请前往[我的]页面完成授权登录',
          success(res) {}
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
    baseUrl: 'https://fang.bigdnsoft.cn',
    wssUrl: 'wss://fang.bigdnsoft.cn/websocket/',
    token: '',
    uid: '',
    bus: eventbus.eventBus,
    unReadMsgNum: 0,
    playingUrl: ''
  }
})

export default {
  initWss
}