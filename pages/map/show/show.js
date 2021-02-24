// pages/map/show/show.js
let app = getApp()
let tag = 'map/show.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapHeight: 0,
    lng: 0,
    lat: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(tag + ' onLoad, lng: ' + options.lng + ', lat: ' + options.lat)

    this.setData({
      lng: options.lng,
      lat: options.lat
    })

    let that = this

    wx.createSelectorQuery()
      .in(that)
      .select('#basebar')
      .boundingClientRect()
      .exec(function (res) {
        console.log(tag + ' createSelectorQuery res ' + res[0].height) // unit is px
        var realHeight = res[0].height * app.globalData.pixelRatio
        that.setData({          
          mapHeight: app.globalData.screenHeight - realHeight
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})