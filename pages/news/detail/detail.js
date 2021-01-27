// pages/news/detail/detail.js
let app = getApp()
let TAG = 'news-detail.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '新闻咨询',
    newsDetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(TAG + ' onLoad id ' + options.newsId + ' title ' + options.title)
    if (options.title != null) {
      this.setData({
        title: options.title
      })
    }
    this.getNewsDetail(options.newsId)
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

  getNewsDetail(newsId) {

    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/news/getDetail',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        newsId: newsId
      },
      success(res) {
        console.log(TAG + ' getNewsDetail success')
        if (res.data.code != 0) {
          console.error(TAG + ' getNewsDetail success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          var newsDetail = res.data.data
          if (newsDetail == null) {
            console.error(TAG + ' getNewsDetail newsDetail == null')
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          console.log('newsDetail.file_path ' + newsDetail.file_path)

          that.setData({
            newsDetail: newsDetail
          })
        }
      },
      fail(res) {
        console.log(TAG + ' getNewsDetail fail res ' + res.errMsg)
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