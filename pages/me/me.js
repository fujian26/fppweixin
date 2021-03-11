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

    }
  }
})