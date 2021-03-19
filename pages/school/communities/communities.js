// pages/school/communities/communities.js
let app = getApp()
let tag = 'pages/school/communities/communities.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    schoolId: 0,
    communities: [],
    communityTotalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title
    let schoolId = options.schoolId
    
    this.setData({
      title: title
    })

    this.data.schoolId = schoolId
    this.getCommunityList(schoolId)
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

  getCommunityList(schoolId) {

    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/school/getCommunityList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "schoolId": schoolId,
        'pageIndex': 0,
        'pageSize': 0
      },
      success(res) {
        console.log(tag + ' getCommunityList success')
        if (res.data.code != 0) {
          console.error(tag + ' getCommunityList success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          
          var communities = res.data.data
          
          if (communities == null) {
            console.error(TAG + ' getCommunityList error communities == null')
            return
          }

          var showCommunities = []
          for (var i = 0; i < 5 && i < communities.length; i++) {
            showCommunities.push(communities[i])
          }      

          that.setData({
            communities: showCommunities,
            communityTotalNum: communities.length
          })
        }
      },
      fail(res) {
        console.error(tag + ' getCommunityList fail res ' + res.errMsg)
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