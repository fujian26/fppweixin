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
    },
    rigthFunction: Object
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
      console.log('tapLeft')
    },

    tapRight(event) {
      console.log('tapRight')
    }
  }
})
