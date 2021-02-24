// pages/comments/comments.js
let app = getApp()
let tag = '/pages/comments/comments.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    type: 0, // 0-community 1-news 2-school
    commentsNum: 0,
    comments: [],
    pageIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.id = options.id
    this.data.type = options.type

    this.loadDatas(true)
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
    console.log('onReachBottom')
    this.loadDatas(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadDatas(showLoading) {

    let pageIndex = this.data.pageIndex
    let type = this.data.type
    let id = this.data.id
    var comments = this.data.comments

    let that = this

    if (showLoading) {
      wx.showLoading({
        title: '',
      })
    }

    wx.request({
      url: app.globalData.baseUrl + '/comments/getList',
      method: 'GET',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "id": id,
        "type": type,
        "pageIndex": pageIndex,
        "pageSize": 20
      },
      success(res) {
        console.log('loadDatas success')
        if (res.data.code != 0) {
          console.error(tag + ' loadDatas success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '加载失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          if (res.data.data == null || res.data.data.length == 0) {
            wx.showToast({
              title: '没有数据了',
            })
            return
          }

          comments = comments.concat(res.data.data)

          var commentsNum = res.header.total

          that.setData({
            comments: comments,
            commentsNum: commentsNum,
            pageIndex: pageIndex + 1            
          })
        }
      },
      fail(res) {
        console.error('loadDatas fail res ' + res.errMsg)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      },
      complete(res) {
        if (showLoading) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
  }
})