// components/house/filters/filters.js
let tag = 'components/house/filters/filters.js'
let app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    showFilterIndex: {
      type: Number,
      value: 0
    }
  },

  observers: {
    'showFilterIndex': function (newValue) {      
      this.setData({
        selectIndex: newValue
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapFilterArea(event) {
      console.log('tapFilterArea')
      this.setData({
        selectIndex: 0
      })
    },

    tapFilterRoomType(event) {
      console.log('tapFilterRoomType')
      this.setData({
        selectIndex: 1
      })
    },

    tapFilterPrice(event) {
      console.log('tapFilterPrice')
      this.setData({
        selectIndex: 2
      })
    },

    tapFilterMore(event) {
      console.log('tapFilterMore')
      this.setData({
        selectIndex: 3
      })
    },

    onConfirmed(event) {
      let type = event.detail.type
      console.log(tag + ' onConfirmed type: ' + type)
      this.triggerEvent("onConfirmed", {
        type: type
      }, {})
    }
  }
})