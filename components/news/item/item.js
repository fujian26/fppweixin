// components/news/item/item.js
let tag = 'components/news/item/item.js'
let app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    news: {
      type: Object
    },
    showPadding: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bottomStr: ''
  },

  attached() {
    setTimeout(() => {

      let news = this.properties.news
      var bottomStr = news.from_where

      if (bottomStr != null && bottomStr.length > 0) {
        bottomStr += ' | '
        bottomStr += news.publishTimeListShow
      } else {
        bottomStr = news.publishTimeListShow
      }

      this.setData({
        bottomStr: bottomStr
      })

    }, 100)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapItem(event) {
      console.log('tapItem')
      let news = this.properties.news
      wx.navigateTo({
        url: '/pages/news/detail/detail?newsId=' + news.id,
        fail(res) {
          console.error(tag + ' navigate to detail fail: ' + res.errMsg)
        }
      })
    }
  }
})