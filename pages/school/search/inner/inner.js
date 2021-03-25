// pages/school/search/inner/inner.js
let tag = 'pages/school/search/inner/inner.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationName: app.globalData.cityName,
    schoolExts: [],
    lng: app.globalData.lng,
    lat: app.globalData.lat
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

  onSearchFocused(event) {
    console.log(tag + ' onSearchFocused')
  },

  onSearchInput(event) {

    let value = event.detail.value
    this.data.searchStr = value

    console.log(tag + ' onSearchInput ' + value)
    if (value == null || value.length == 0) {
      let houses = this.data.normalHouses
      this.setData({
        houses: houses
      })
    }
  },

  doSearch(event) {
    let value = event.detail.value
    console.log(tag + ' doSearch ' + value)

    if (value == null || value.length == 0) {
      return
    }

    this.searchDatas(value)
  },

  searchDatas(content) {

    let lng = this.data.lng
    let lat = this.data.lat
    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/school/blurSearch',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "keyWord": content,
        "lng": lng,
        "lat": lat
      },
      success(res) {
        console.log(tag + ' searchDatas success')
        if (res.data.code != 0) {
          console.error(tag + ' searchDatas success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var schoolExts = res.data.data
          if (schoolExts == null || schoolExts.length == 0) {
            wx.showToast({
              title: '没有数据',
              icon: 'none'
            })
            that.setData({
              schoolExts: []
            })
            return
          }

          that.setData({
            schoolExts: schoolExts
          })
        }
      },
      fail(res) {
        console.error(tag + ' searchDatas fail res ' + res.errMsg)
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