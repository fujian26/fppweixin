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
    nickName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapSetting(event) {
      
    }
  }
})
