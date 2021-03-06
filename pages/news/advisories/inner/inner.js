// pages/news/advisories/inner/inner.js
let tag = 'pages/news/advisories/inner/inner.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  doSearch(event) {
    let value = event.detail.value
    console.log('doSearch value: ' + value)

    this.searchContent(value)
  },

  searchContent(value) {

    if (value == null || value.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return
    }

    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/news/searchAdvisoryList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'content': value
      },
      success(res) {
        if (res.data.code != 0) {
          console.error(tag + ' searchContent res.data.code != 0: ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        that.setData({
          items: res.data.data
        })
      },
      fail(res) {
        console.error(tag + ' searchContent fail ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  }
})