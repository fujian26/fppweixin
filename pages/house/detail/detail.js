// pages/house/detail/detail.js
let tag = 'pages/house/detail/detail.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '二手房源详情',
    house: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  initHouse() {

    let that = this
    var title = this.data.title

    wx.getStorage({
      key: 'house',
      success(res) {
        var house = res.data

        if (house.source_type == 1) {
          title = '法拍房房源详情'
        }

        
      },
      fail(res) {
        console.error(tag + ' initHouse fail res: ' + res.errMsg)
      }
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

  },

  tapSwiper(event) {
    console.log(tag + ' tapSwiper')
  }
})