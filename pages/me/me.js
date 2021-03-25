// pages/me/me.js
let app = getApp()
Component({

  created() {
    setInterval(() => {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }, 16)
  },

  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    topBgUrl: app.globalData.baseUrl + '/file/download/me_top_bg.png',
    userInfo: null,
    nickName: '',
    floatBarDatas: [{
        id: 1,
        image: '/images/me_attention.png',
        text: '我的关注'
      },
      {
        id: 2,
        image: '/images/me_certification.png',
        text: '业主认证'
      },
      {
        id: 3,
        image: '/images/me_house.png',
        text: '我的房产'
      },
      {
        id: 4,
        image: '/images/me_content.png',
        text: '我的内容'
      },
      {
        id: 5,
        image: '/images/me_platform.png',
        text: '入住平台'
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapSetting(event) {

    },

    tapFloatBar(event) {
      var id = event.currentTarget.dataset.id
      console.log('tapFloatBar id: ' + id)
      switch (id) {
        case 1: // 我的关注
          wx.navigateTo({
            url: '/pages/me/attentions/attentions',
            fail(res) {
              console.error('navigate to attentions fail: ' + res.errMsg)
            }
          })
          break
      }
    },

    // 历史记录
    tapHistory(event) {

    },

    // 内容推送
    changeContentPush(event) {
      console.log('changeContentPush value ' + event.detail.value)
    },

    // 退出登录
    tapLogout(event) {

    },

    wxLogin(detail) {

      let that = this

      wx.login({
        timeout: 60000, // 超时1分钟
        success(res) {

          var loginCode = res.code
          if (loginCode == null || loginCode.length == 0) {
            console.error('wxLogin loginCode == null || loginCode.length == 0')
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })

            wx.hideHomeButton({
              success: (res) => {},
            })            

            return
          }

          app.globalData.loginCode = loginCode
          that.obtainToken(true, loginCode, detail)
        },
        fail(res) {
          console.error('wxLogin fail: ' + res.errMsg)

          wx.hideHomeButton({
            success: (res) => {},
          })

          wx.showToast({
            title: '操作失败 ' + res.errMsg,
            icon: 'none'
          })
        }        
      })
    },

    obtainToken(showLoading, loginCode, res) {

      let that = this
      let userInfo = res.userInfo

      if (showLoading) {
        wx.showLoading({
          title: '',
        })
      }

      wx.request({
        url: app.globalData.baseUrl + '/wx/obtainSession',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          loginCode: app.globalData.loginCode,
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
          app.globalData.token = res.data.data
          that.setData({
            userInfo: userInfo
          })
        },
        fail(res) {
          console.error('onUserInfoGet obtainSession fail res ' + res.errMsg)
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
        },
        complete(res) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    },

    onUserInfoGet(event) {

      console.log('onUserInfoGet', event)
      let res = event.detail
      
      if (app.globalData.loginCode == null || app.globalData.loginCode.length == 0) {
        this.wxLogin(res)
      } else {
        this.obtainToken(true, app.globalData.loginCode, res)
      }
    }
  }
})