// pages/school/basic/basic.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolExt: null,
    logoUrl: '',
    importantStr: null,
    typeStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'schoolExt',
      success(res) {

        var logoUrl = ''

        for (var i = 0; i < res.data.pics.length; i++) {
          if (res.data.pics[i].type == 2) {
            logoUrl = res.data.pics[i].url
            break
          }
        }

        logoUrl = app.globalData.baseUrl + "/file/download/" + logoUrl
        console.log('logoUrl ' + logoUrl)

        var typeStr = ''
        switch (res.data.school.type) {
          case 0:
            typeStr = '幼儿园'
            break
          case 1:
            typeStr = '小学'
            break
          case 2:
            typeStr = '中学'
            break
          case 3:
            typeStr = '培训机构'
            break
          default:
            typeStr = '学校'
        }

        var importantStr = null
        if (res.data.school.is_key == 1) {
          importantStr = '重点' + typeStr
        }

        that.setData({
          schoolExt: res.data,
          logoUrl: logoUrl,
          importantStr: importantStr,
          typeStr: typeStr
        })
      },
      fail(res) {
        console.log('basic created fail res: ' + res.errMsg)
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

  rightTapFromBar(event) {
    console.log('basic.js rightTapFromBar')
  }
})