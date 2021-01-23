// pages/map/map.js
let app = getApp()
Component({

  attached() {
    let that = this
    wx.createSelectorQuery()
      .in(that)
      .select('#basebar')
      .boundingClientRect()
      .exec(function (res) {
        console.log('createSelectorQuery res ' + res[0].height)
        that.setData({
          mapHeight: app.globalData.screenHeight - res[0].height
        })
      })
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
    mapHeight: 0,
    lng: app.globalData.lng,
    lat: app.globalData.lat
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})