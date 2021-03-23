// pages/school/dynamiclist/dynamiclist.js
let app = getApp()
let tag = 'pages/school/dynamiclist/dynamiclist.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    schoolId: 0,
    dynamics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.schoolId = Number(options.schoolId)
    this.getDynamics()
  },

  getDynamics() {
    let that = this
    var dynamics = this.data.dynamics
    var pageIndex = this.data.pageIndex

    wx.request({
      url: app.globalData.baseUrl + '/news/getVariatyNewsList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'id': this.data.schoolId,
        'type': 0,
        'pageIndex': pageIndex,
        'pageSize': 30
      },
      success(res) {
        if (res.data.code != 0 || res.data.data == null) {
          console.error('getDynamics fail: ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data.length == 0) {
          wx.showToast({
            title: pageIndex == 0 ? '没有数据' : '没有数据了',
            icon: 'none'
          })
          return
        }

        if (pageIndex == 0) {
          dynamics = res.data.data
        } else {
          dynamics = dynamics.concat(res.data.data)
        }

        that.setData({
          dynamics: dynamics,
          pageIndex: pageIndex + 1
        })
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
    this.getDynamics()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})