// pages/msg/msg.js
Component({
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
    leftClick: function() {
      console.log('left click from msg, this: ' + this)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    rightTapFromBar(event) {
      console.log('rightTapFromBar event ' + event)
    }
  }
})
