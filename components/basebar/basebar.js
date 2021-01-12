// components/basebar/basebar.js
let app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    leftAction: {
      type: String,
      value: 'back'
    },
    centerText: String,
    rightIcon: {
      type: String,
      value: 'more'
    }
  },

  observers: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarHeight: app.globalData.StatusBar
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapLeft(event) {
      this.triggerEvent('tapLeft')
      wx.navigateBack()
    },

    tapRight(event) {
      var eventDetail = {} // detail对象，提供给事件监听函数
      var eventOption = {} // 触发事件的选项
      this.triggerEvent('tapRight', eventDetail, eventOption)
    }
  }
})